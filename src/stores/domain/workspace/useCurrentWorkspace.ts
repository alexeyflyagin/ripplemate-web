import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkspaceStore } from './index'

export function useCurrentWorkspace() {
  const router = useRouter()
  const route = useRoute()
  const workspaceStore = useWorkspaceStore()

  const currentWorkspaceId = computed<number | undefined>(
    () => {
      const id = Number(route.params.workspaceId)
      return id && workspaceStore.findWorkspaceById(id)
        ? id
        : undefined
    },
  )

  const currentWorkspace = computed(() =>
    workspaceStore.findWorkspaceById(
      currentWorkspaceId.value,
    ),
  )

  function selectWorkspace(id: number) {
    router.push({
      name: 'library',
      params: { workspaceId: String(id) },
    })
  }

  return {
    currentWorkspaceId,
    currentWorkspace,
    selectWorkspace,
  }
}
