import {
  getWorkspaces as getWorkspacesApi,
  getWorkspaceById as getWorkspaceByIdApi,
  updateWorkspace as updateWorkspaceApi,
  createWorkspace as createWorkspaceApi,
  deleteWorkspace as deleteWorkspaceApi,
} from '@/api/repositories/workspace'
import type {
  WorkspaceCreate,
  WorkspaceRead,
  WorkspaceUpdate,
} from '@/api/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkspaceStore = defineStore(
  'workspace',
  () => {
    const workspaces = ref<WorkspaceRead[]>([])

    function getCachedById(id: string | undefined | null) {
      if (!id) return undefined
      return workspaces.value.find((w) => w.id === id)
    }

    async function getWorkspaces() {
      workspaces.value = await getWorkspacesApi()
      return workspaces.value
    }

    async function getWorkspace(id: string) {
      const found = getCachedById(id)
      if (found) return found

      const workspace = await getWorkspaceByIdApi(id)
      if (!workspace) throw new Error('Workspace not found')
      return workspace
    }

    async function updateWorkspace(
      id: string,
      data: WorkspaceUpdate,
    ) {
      const updated = await updateWorkspaceApi(id, data)
      workspaces.value = workspaces.value.map((w) =>
        w.id === id ? updated : w,
      )
      return updated
    }

    async function createWorkspace(data: WorkspaceCreate) {
      const created = await createWorkspaceApi(data)
      workspaces.value.push(created)
      return created
    }

    async function deleteWorkspace(id: string) {
      await deleteWorkspaceApi(id)
      workspaces.value = workspaces.value.filter(
        (w) => w.id !== id,
      )
    }

    return {
      workspaces,
      getWorkspaces,
      getWorkspace,
      getCachedById,
      updateWorkspace,
      createWorkspace,
      deleteWorkspace,
    }
  },
)
