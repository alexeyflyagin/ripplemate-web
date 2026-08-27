import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getCards as getCardsApi,
  createCard as createCardApi,
  updateCard as updateCardApi,
  deleteCard as deleteCardApi,
  getCard as getCardApi,
} from '@/api/repositories/card'
import type {
  CardCreate,
  CardRead,
  CardUpdate,
} from '@/api/types'
import { useDebounceFn } from '@vueuse/core'

const PAGE_SIZE = 100

interface Segment {
  items: CardRead[]
  total: number
}

function segmentKey(categoryId: string | null): string {
  return categoryId ?? 'all'
}

export const useCardStore = defineStore('card', () => {
  const cache = ref<Map<string, Segment>>(new Map())
  const cachedWorkspaceId = ref<string | null>(null)

  const searchResults = ref<CardRead[]>([])
  const searchTotal = ref(0)

  const isLoading = ref(false)
  const search = ref<string | null>(null)
  const activeCategoryId = ref<string | null>(null)

  let requestId = 0

  const isSearching = computed(
    () => search.value !== null && search.value !== '',
  )

  const activeSegment = computed<Segment | undefined>(() =>
    cache.value.get(segmentKey(activeCategoryId.value)),
  )

  const cards = computed<CardRead[]>(() => {
    if (isSearching.value) return searchResults.value
    return activeSegment.value?.items ?? []
  })

  const total = computed<number>(() =>
    isSearching.value
      ? searchTotal.value
      : (activeSegment.value?.total ?? 0),
  )

  const hasMore = computed<boolean>(() => {
    if (isSearching.value) {
      return searchResults.value.length < searchTotal.value
    }
    const seg = activeSegment.value
    return seg ? seg.items.length < seg.total : false
  })

  function resetWorkspaceIfChanged(workspaceId: string) {
    if (cachedWorkspaceId.value !== workspaceId) {
      cache.value.clear()
      cachedWorkspaceId.value = workspaceId
    }
  }

  async function fetchSegmentPage(
    workspaceId: string,
    categoryId: string | null,
    offset: number,
  ): Promise<Segment | null> {
    const current = ++requestId
    const res = await getCardsApi(
      workspaceId,
      categoryId,
      null,
      PAGE_SIZE,
      offset,
    )
    if (current !== requestId) return null
    return { items: res.items, total: res.total }
  }

  async function revalidateSegment(
    workspaceId: string,
    categoryId: string | null,
  ) {
    const page = await fetchSegmentPage(
      workspaceId,
      categoryId,
      0,
    )
    if (!page) return
    const key = segmentKey(categoryId)
    const existing = cache.value.get(key)

    if (!existing || existing.items.length <= page.items.length) {
      cache.value.set(key, page)
      return
    }

    const byId = new Map(existing.items.map((c) => [c.id, c]))
    for (const fresh of page.items) {
      const current = byId.get(fresh.id)
      if (current) Object.assign(current, fresh)
    }
    const existingIds = new Set(byId.keys())
    const prepend = page.items.filter(
      (c) => !existingIds.has(c.id),
    )
    existing.items = [...prepend, ...existing.items]
    existing.total = page.total
    cache.value.set(key, { ...existing })
  }

  async function runSearch(
    workspaceId: string,
    reset: boolean,
  ) {
    isLoading.value = true
    const current = ++requestId
    try {
      const offset = reset ? 0 : searchResults.value.length
      const res = await getCardsApi(
        workspaceId,
        null,
        search.value,
        PAGE_SIZE,
        offset,
      )
      if (current !== requestId) return
      if (reset) searchResults.value = res.items
      else searchResults.value.push(...res.items)
      searchTotal.value = res.total
    } finally {
      if (current === requestId) isLoading.value = false
    }
  }

  async function loadCards(
    workspaceId: string,
    categoryId: string | null,
  ) {
    resetWorkspaceIfChanged(workspaceId)
    activeCategoryId.value = categoryId

    if (isSearching.value) {
      await runSearch(workspaceId, true)
      return
    }

    const key = segmentKey(categoryId)

    if (cache.value.has(key)) {
      revalidateSegment(workspaceId, categoryId)
      return
    }

    isLoading.value = true
    try {
      const page = await fetchSegmentPage(
        workspaceId,
        categoryId,
        0,
      )
      if (page) cache.value.set(key, page)
    } finally {
      isLoading.value = false
    }
  }

  async function loadMore(
    workspaceId: string,
    categoryId: string | null,
  ) {
    if (isLoading.value || !hasMore.value) return

    if (isSearching.value) {
      await runSearch(workspaceId, false)
      return
    }

    const key = segmentKey(categoryId)
    const seg = cache.value.get(key)
    if (!seg) return

    isLoading.value = true
    const current = ++requestId
    try {
      const res = await getCardsApi(
        workspaceId,
        categoryId,
        null,
        PAGE_SIZE,
        seg.items.length,
      )
      if (current !== requestId) return
      const seen = new Set(seg.items.map((c) => c.id))
      const fresh = res.items.filter((c) => !seen.has(c.id))
      cache.value.set(key, {
        items: [...seg.items, ...fresh],
        total: res.total,
      })
    } finally {
      if (current === requestId) isLoading.value = false
    }
  }

  function clearWorkspaceCache() {
    cache.value.clear()
    cachedWorkspaceId.value = null
  }

  async function createCard(
    workspaceId: string,
    _categoryId: string | null,
    data: CardCreate,
  ) {
    const created = await createCardApi(workspaceId, data)

    const allSeg = cache.value.get('all')
    if (allSeg) {
      cache.value.set('all', {
        items: [created, ...allSeg.items],
        total: allSeg.total + 1,
      })
    }
    if (created.category_id !== null) {
      const catKey = segmentKey(created.category_id)
      const catSeg = cache.value.get(catKey)
      if (catSeg) {
        cache.value.set(catKey, {
          items: [created, ...catSeg.items],
          total: catSeg.total + 1,
        })
      }
    }
    return created
  }

  async function updateCard(
    workspaceId: string,
    _categoryId: string | null,
    cardId: string,
    data: CardUpdate,
  ) {
    const updated = await updateCardApi(
      workspaceId,
      cardId,
      data,
    )

    for (const [key, seg] of cache.value) {
      const idx = seg.items.findIndex((c) => c.id === cardId)
      if (idx === -1) continue

      const inThisCategory =
        key === 'all' ||
        key === segmentKey(updated.category_id)

      if (inThisCategory) {
        const items = seg.items.slice()
        items[idx] = { ...items[idx], ...updated }
        cache.value.set(key, { items, total: seg.total })
      } else {
        cache.value.set(key, {
          items: seg.items.filter((c) => c.id !== cardId),
          total: seg.total - 1,
        })
      }
    }

    if (updated.category_id !== null) {
      const catKey = segmentKey(updated.category_id)
      const catSeg = cache.value.get(catKey)
      if (
        catSeg &&
        !catSeg.items.some((c) => c.id === cardId)
      ) {
        cache.value.set(catKey, {
          items: [updated, ...catSeg.items],
          total: catSeg.total + 1,
        })
      }
    }

    return updated
  }

  async function deleteCard(
    workspaceId: string,
    cardId: string,
  ) {
    await deleteCardApi(workspaceId, cardId)
    for (const [key, seg] of cache.value) {
      const items = seg.items.filter((c) => c.id !== cardId)
      if (items.length !== seg.items.length) {
        cache.value.set(key, { items, total: seg.total - 1 })
      }
    }
  }

  function getCard(workspaceId: string, cardId: string) {
    for (const seg of cache.value.values()) {
      const found = seg.items.find((c) => c.id === cardId)
      if (found) return Promise.resolve(found)
    }
    return getCardApi(workspaceId, cardId)
  }

  const setSearch = useDebounceFn(
    (value: string | null) => {
      search.value = value
    },
    300,
  )

  return {
    cards,
    total,
    isLoading,
    hasMore,
    search,
    setSearch,
    loadCards,
    loadMore,
    createCard,
    updateCard,
    deleteCard,
    getCard,
    clearWorkspaceCache,
  }
})
