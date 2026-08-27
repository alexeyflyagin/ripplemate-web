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
      for (const item of res.items) {
        if (!seen.has(item.id)) seg.items.push(item)
      }
      seg.total = res.total
      cache.value.set(key, { ...seg })
    } finally {
      if (current === requestId) isLoading.value = false
    }
  }

  function clearWorkspaceCache() {
    cache.value.clear()
    cachedWorkspaceId.value = null
  }

  function forEachSegment(
    fn: (seg: Segment, key: string) => void,
  ) {
    for (const [key, seg] of cache.value) {
      fn(seg, key)
      cache.value.set(key, { ...seg })
    }
  }

  async function createCard(
    workspaceId: string,
    _categoryId: string | null,
    data: CardCreate,
  ) {
    const created = await createCardApi(workspaceId, data)

    const allSeg = cache.value.get('all')
    if (allSeg) {
      allSeg.items.unshift(created)
      allSeg.total += 1
      cache.value.set('all', { ...allSeg })
    }
    if (created.category_id !== null) {
      const catKey = segmentKey(created.category_id)
      const catSeg = cache.value.get(catKey)
      if (catSeg) {
        catSeg.items.unshift(created)
        catSeg.total += 1
        cache.value.set(catKey, { ...catSeg })
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

    forEachSegment((seg, key) => {
      const idx = seg.items.findIndex((c) => c.id === cardId)
      if (idx === -1) return

      const inThisCategory =
        key === 'all' || key === segmentKey(updated.category_id)

      if (inThisCategory) {
        seg.items[idx] = { ...seg.items[idx], ...updated }
      } else {
        seg.items.splice(idx, 1)
        seg.total -= 1
      }
    })

    if (updated.category_id !== null) {
      const catKey = segmentKey(updated.category_id)
      const catSeg = cache.value.get(catKey)
      if (
        catSeg &&
        !catSeg.items.some((c) => c.id === cardId)
      ) {
        catSeg.items.unshift(updated)
        catSeg.total += 1
        cache.value.set(catKey, { ...catSeg })
      }
    }

    return updated
  }

  async function deleteCard(
    workspaceId: string,
    cardId: string,
  ) {
    await deleteCardApi(workspaceId, cardId)
    forEachSegment((seg) => {
      const before = seg.items.length
      seg.items = seg.items.filter((c) => c.id !== cardId)
      if (seg.items.length < before) seg.total -= 1
    })
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
