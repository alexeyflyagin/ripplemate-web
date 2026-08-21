import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
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
import { useWorkspaceStore } from './workspace'
import { useCategoryStore } from './category'

const PAGE_SIZE = 100

export const useCardStore = defineStore('card', () => {
  const workspaceStore = useWorkspaceStore()
  const categoryStore = useCategoryStore()

  const cards = ref<CardRead[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const search = ref<string | null>(null)

  let searchTimeout: ReturnType<typeof setTimeout>
  let requestId = 0

  const hasMore = computed(
    () => cards.value.length < total.value,
  )

  async function loadCards() {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId) {
      cards.value = []
      total.value = 0
      return
    }

    cards.value = []
    isLoading.value = true
    const currentRequestId = ++requestId
    try {
      const response = await getCardsApi(
        workspaceId,
        categoryStore.currentCategoryId,
        search.value,
        PAGE_SIZE,
        0,
      )
      if (currentRequestId !== requestId) return
      cards.value = response.items
      total.value = response.total
    } finally {
      if (currentRequestId !== requestId) return
      isLoading.value = false
    }
  }

  async function loadMore() {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId || isLoading.value || !hasMore.value)
      return

    isLoading.value = true
    const currentRequestId = ++requestId
    try {
      const response = await getCardsApi(
        workspaceId,
        categoryStore.currentCategoryId,
        search.value,
        PAGE_SIZE,
        cards.value.length,
      )
      if (currentRequestId !== requestId) return
      cards.value.push(...response.items)
      total.value = response.total
    } finally {
      if (currentRequestId !== requestId) return
      isLoading.value = false
    }
  }

  async function createCard(data: CardCreate) {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId)
      throw new Error('No workspace selected')

    const createdCard = await createCardApi(
      workspaceId,
      data,
    )

    const cat = categoryStore.currentCategoryId
    if (cat === null || createdCard.category_id === cat) {
      cards.value.unshift(createdCard)
      total.value += 1
    }

    return createdCard
  }

  async function updateCard(
    cardId: number,
    data: CardUpdate,
  ) {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId)
      throw new Error('No workspace selected')

    const oldCard = cards.value.find((c) => c.id === cardId)

    const updatedCard = await updateCardApi(
      workspaceId,
      cardId,
      data,
    )

    if (oldCard) {
      if (
        oldCard.category_id !== updatedCard.category_id &&
        categoryStore.currentCategoryId !== null
      ) {
        cards.value = cards.value.filter(
          (c) => c.id !== cardId,
        )
        total.value -= 1
      } else {
        Object.assign(oldCard, updatedCard)
      }
    }

    return updatedCard
  }

  async function deleteCard(cardId: number) {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId)
      throw new Error('No workspace selected')

    await deleteCardApi(workspaceId, cardId)

    cards.value = cards.value.filter((c) => c.id !== cardId)
    total.value -= 1
  }

  async function getCard(cardId: number) {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId)
      throw new Error('No workspace selected')

    return getCardApi(workspaceId, cardId)
  }

  function setSearch(value: string | null) {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      search.value = value
    }, 300)
  }

  watch(
    () => [
      workspaceStore.currentWorkspaceId,
      categoryStore.currentCategoryId,
      search.value,
    ],
    () => {
      loadCards()
    },
    { immediate: true },
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
