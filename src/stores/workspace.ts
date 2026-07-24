import {
  getWorkspaces as getWorkspacesApi,
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
import { computed, ref, watch } from 'vue'

const CURRENT_WORKSPACE_ID = 'currentWorkspaceId'

export const useWorkspaceStore = defineStore(
  'workspace',
  () => {
    const workspaces = ref<WorkspaceRead[]>([])
    const currentWorkspaceId = ref<number | null>(
      getStoredWorkspaceId(),
    )

    const currentWorkspace = computed<
      WorkspaceRead | undefined
    >(() =>
      workspaces.value.find(
        (w) => w.id === currentWorkspaceId.value,
      ),
    )

    function getStoredWorkspaceId(): number | null {
      const stored = localStorage.getItem(
        CURRENT_WORKSPACE_ID,
      )
      if (stored === null) return null
      const parsed = Number(stored)
      return isNaN(parsed) ? null : parsed
    }

    async function getWorkspaces() {
      workspaces.value = await getWorkspacesApi()

      if (
        !currentWorkspace.value &&
        workspaces.value.length > 0
      ) {
        changeCurrentWorkspace(workspaces.value[0]!.id)
      }
    }

    function changeCurrentWorkspace(id: number | null) {
      if (id !== null) {
        if (!workspaces.value.some((w) => w.id === id))
          throw new Error('Workspace was not found')
      }

      currentWorkspaceId.value = id

      if (id === null) {
        localStorage.removeItem(CURRENT_WORKSPACE_ID)
      } else {
        localStorage.setItem(
          CURRENT_WORKSPACE_ID,
          String(id),
        )
      }
    }

    async function updateCurrentWorkspace(
      data: WorkspaceUpdate,
    ) {
      if (!currentWorkspaceId.value)
        throw new Error('No current workspace selected')

      const updatedWorkspace = await updateWorkspaceApi(
        currentWorkspaceId.value,
        data,
      )

      workspaces.value = workspaces.value.map((w) =>
        w.id === currentWorkspaceId.value
          ? updatedWorkspace
          : w,
      )
    }

    async function createWorkspace(data: WorkspaceCreate) {
      const createdWorkspace =
        await createWorkspaceApi(data)
      workspaces.value.push(createdWorkspace)
      changeCurrentWorkspace(createdWorkspace.id)
    }

    async function deleteCurrentWorkspace() {
      if (!currentWorkspaceId.value)
        throw new Error('No current workspace selected')

      const deletedId = currentWorkspaceId.value
      const index = workspaces.value.findIndex(
        (w) => w.id == deletedId,
      )

      await deleteWorkspaceApi(deletedId)

      workspaces.value = workspaces.value.filter(
        (w) => w.id !== deletedId,
      )

      const newCurrentWorkspaceId =
        workspaces.value[
          index === 0 && workspaces.value.length > 0
            ? 0
            : index - 1
        ]?.id ?? null

      changeCurrentWorkspace(newCurrentWorkspaceId)
    }

    return {
      workspaces,
      currentWorkspaceId,
      currentWorkspace,
      getWorkspaces,
      changeCurrentWorkspace,
      updateCurrentWorkspace,
      createWorkspace,
      deleteCurrentWorkspace,
    }
  },
)
