import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import {
  getCards as getCardsApi,
  createCard as createCardApi,
  updateCard as updateCardApi,
  deleteCard as deleteCardApi,
  getRandomCard as getRandomCardApi,
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

  const randomCard = ref<CardRead | null>(null)

  let searchTimeout: ReturnType<typeof setTimeout>

  const hasMore = computed(
    () => cards.value.length < total.value,
  )

  async function reloadCards() {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId) {
      cards.value = []
      total.value = 0
      return
    }

    isLoading.value = true
    try {
      const response = await getCardsApi(
        workspaceId,
        categoryStore.currentCategoryId,
        search.value,
        PAGE_SIZE,
        0,
      )
      cards.value = response.items
      total.value = response.total
    } finally {
      isLoading.value = false
    }
  }

  async function loadMore() {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId || isLoading.value || !hasMore.value)
      return

    isLoading.value = true
    try {
      const response = await getCardsApi(
        workspaceId,
        categoryStore.currentCategoryId,
        search.value,
        PAGE_SIZE,
        cards.value.length,
      )
      cards.value.push(...response.items)
      total.value = response.total
    } finally {
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

    cards.value.unshift(createdCard)
    total.value += 1

    return createdCard
  }

  async function updateCard(
    cardId: number,
    data: CardUpdate,
  ) {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId)
      throw new Error('No workspace selected')

    const updatedCard = await updateCardApi(
      workspaceId,
      cardId,
      data,
    )

    await reloadCards()

    return updatedCard
  }

  async function deleteCard(cardId: number) {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId)
      throw new Error('No workspace selected')

    await deleteCardApi(workspaceId, cardId)

    await reloadCards()
  }

  async function getRandomCard() {
    const workspaceId = workspaceStore.currentWorkspaceId
    if (!workspaceId)
      throw new Error('No workspace selected')

    randomCard.value = await getRandomCardApi(
      workspaceId,
      categoryStore.currentCategoryId,
    )

    return randomCard.value
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
      reloadCards()
    },
    { immediate: true },
  )

  return {
    cards,
    total,
    isLoading,
    hasMore,
    search,
    randomCard,
    setSearch,
    reloadCards,
    loadMore,
    createCard,
    updateCard,
    deleteCard,
    getRandomCard,
    getCard,
  }
})
