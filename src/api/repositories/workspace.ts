import { del, get, patchJson, postJson } from '../client'
import type {
  WorkspaceCreate,
  WorkspaceRead,
  WorkspaceUpdate,
} from '../types'

export function getWorkspaces(): Promise<WorkspaceRead[]> {
  return get<WorkspaceRead[]>('/workspaces')
}

export function createWorkspace(
  data: WorkspaceCreate,
): Promise<WorkspaceRead> {
  return postJson<WorkspaceRead>('/workspaces', data)
}

export function getWorkspaceById(
  workspaceId: string,
): Promise<WorkspaceRead> {
  return get<WorkspaceRead>(`/workspaces/${workspaceId}`)
}

export function updateWorkspace(
  workspaceId: string,
  data: WorkspaceUpdate,
): Promise<WorkspaceRead> {
  return patchJson<WorkspaceRead>(
    `/workspaces/${workspaceId}`,
    data,
  )
}

export function deleteWorkspace(
  workspaceId: string,
): Promise<void> {
  return del(`/workspaces/${workspaceId}`)
}
