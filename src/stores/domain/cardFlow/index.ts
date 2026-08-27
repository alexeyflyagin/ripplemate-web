import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRandomCard as getRandomCardApi } from '@/api/repositories/card'
import type { CardRead } from '@/api/types'

export const useCardFlowStore = defineStore(
  'cardFlow',
  () => {
    const currentCard = ref<CardRead | undefined>()
    const isLoading = ref(false)
    let requestId = 0

    async function nextCard(
      workspaceId: string,
      categoryId: string | null,
    ) {
      isLoading.value = true
      const current = ++requestId
      try {
        const card = await getRandomCardApi(
          workspaceId,
          categoryId,
        )
        if (current !== requestId) return
        currentCard.value = card
      } catch {
        if (current !== requestId) return
        currentCard.value = undefined
      } finally {
        if (current === requestId) isLoading.value = false
      }
    }

    function clear() {
      currentCard.value = undefined
    }

    return {
      currentCard,
      isLoading,
      nextCard,
      clear,
    }
  },
)
