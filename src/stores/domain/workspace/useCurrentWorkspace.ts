import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkspaceStore } from './index'

export function useCurrentWorkspace() {
  const router = useRouter()
  const route = useRoute()
  const workspaceStore = useWorkspaceStore()

  const currentWorkspaceId = computed<string | undefined>(
    () => {
      const id = route.params.workspaceId
      return typeof id === 'string' &&
        workspaceStore.getCachedById(id)
        ? id
        : undefined
    },
  )

  const currentWorkspace = computed(() =>
    workspaceStore.getCachedById(currentWorkspaceId.value),
  )

  function selectWorkspace(id: string) {
    router.push({
      name: 'library',
      params: { workspaceId: id },
    })
  }

  return {
    currentWorkspaceId,
    currentWorkspace,
    selectWorkspace,
  }
}
