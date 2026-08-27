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

export const useCardStore = defineStore('card', () => {
  const cards = ref<CardRead[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const search = ref<string | null>(null)

  let requestId = 0

  const hasMore = computed(
    () => cards.value.length < total.value,
  )

  async function loadCards(
    workspaceId: string,
    categoryId: string | null,
  ) {
    cards.value = []
    isLoading.value = true
    const current = ++requestId
    try {
      const res = await getCardsApi(
        workspaceId,
        categoryId,
        search.value,
        PAGE_SIZE,
        0,
      )
      if (current !== requestId) return
      cards.value = res.items
      total.value = res.total
    } finally {
      if (current === requestId) isLoading.value = false
    }
  }

  async function loadMore(
    workspaceId: string,
    categoryId: string | null,
  ) {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    const current = ++requestId
    try {
      const res = await getCardsApi(
        workspaceId,
        categoryId,
        search.value,
        PAGE_SIZE,
        cards.value.length,
      )
      if (current !== requestId) return
      cards.value.push(...res.items)
      total.value = res.total
    } finally {
      if (current === requestId) isLoading.value = false
    }
  }

  async function createCard(
    workspaceId: string,
    categoryId: string | null,
    data: CardCreate,
  ) {
    const created = await createCardApi(workspaceId, data)

    if (
      categoryId === null ||
      created.category_id === categoryId
    ) {
      cards.value.unshift(created)
      total.value += 1
    }
    return created
  }

  async function updateCard(
    workspaceId: string,
    categoryId: string | null,
    cardId: number,
    data: CardUpdate,
  ) {
    const oldCard = cards.value.find((c) => c.id === cardId)
    const updated = await updateCardApi(
      workspaceId,
      cardId,
      data,
    )

    if (oldCard) {
      if (
        oldCard.category_id !== updated.category_id &&
        categoryId !== null
      ) {
        cards.value = cards.value.filter(
          (c) => c.id !== cardId,
        )
        total.value -= 1
      } else {
        Object.assign(oldCard, updated)
      }
    }
    return updated
  }

  async function deleteCard(
    workspaceId: string,
    cardId: number,
  ) {
    await deleteCardApi(workspaceId, cardId)
    cards.value = cards.value.filter((c) => c.id !== cardId)
    total.value -= 1
  }

  function getCard(workspaceId: string, cardId: number) {
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
  }
})
