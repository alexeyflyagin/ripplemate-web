import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getRandomCard as getRandomCardApi } from '@/api/repositories/card'
import type { CardRead } from '@/api/types'
import { useWorkspaceStore } from './workspace'
import { useCategoryStore } from './category'

export const useCardFlowStore = defineStore(
  'cardFlow',
  () => {
    const workspaceStore = useWorkspaceStore()
    const categoryStore = useCategoryStore()

    watch(
      [
        () => workspaceStore.currentWorkspaceId,
        () => categoryStore.currentCategoryId,
      ],
      async () => {
        await getNextCard()
      },
    )

    async function getNextCard(): Promise<
      CardRead | undefined
    > {
      if (!workspaceStore.currentWorkspaceId) {
        return undefined
      }

      try {
        return await getRandomCardApi(
          workspaceStore.currentWorkspaceId,
          categoryStore.currentCategoryId,
        )
      } catch {
        return undefined
      }
    }

    return {
      getNextCard,
    }
  },
)
