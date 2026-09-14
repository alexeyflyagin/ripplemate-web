import { useAuthStore } from '@/stores/domain/auth'
import { useCardStore } from '@/stores/domain/card'
import { useCategoryStore } from '@/stores/domain/category'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import { useIntervalFn } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const AUTO_REFRESH_INTERVAL = 60_000

export const useDataRefreshStore = defineStore(
  'dataRefresh',
  () => {
    const authStore = useAuthStore()
    const workspaceStore = useWorkspaceStore()
    const categoryStore = useCategoryStore()
    const cardStore = useCardStore()
    const { currentWorkspaceId } = useCurrentWorkspace()
    const { currentCategoryId } = useCurrentCategory()

    const isRefreshing = ref<boolean>(false)

    async function refresh() {
      if (isRefreshing.value) return
      if (!authStore.isAuthorized) return
      isRefreshing.value = true
      try {
        const workspaceId = currentWorkspaceId.value

        await Promise.all([
          workspaceStore.getWorkspaces(),
          ...(workspaceId
            ? [
                categoryStore.loadCategories(workspaceId),
                cardStore.loadCards(
                  workspaceId,
                  currentCategoryId.value ?? null,
                ),
              ]
            : []),
        ])
      } finally {
        isRefreshing.value = false
      }
    }

    useIntervalFn(refresh, AUTO_REFRESH_INTERVAL)

    return { refresh, isRefreshing }
  },
)
