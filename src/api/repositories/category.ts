import { del, get, patchJson, postJson } from '../client'
import type {
  CategoryCreate,
  CategoryRead,
  CategoryUpdate,
} from '../types'

export function createCategory(
  workspaceId: number,
  data: CategoryCreate,
): Promise<CategoryRead> {
  return postJson<CategoryRead>(
    `/workspaces/${workspaceId}/categories`,
    data,
  )
}

export function getCategories(
  workspaceId: number,
): Promise<CategoryRead[]> {
  return get<CategoryRead[]>(
    `/workspaces/${workspaceId}/categories`,
  )
}

export function getCategory(
  workspaceId: number,
  categoryId: number,
): Promise<CategoryRead> {
  return get<CategoryRead>(
    `/workspaces/${workspaceId}/categories/${categoryId}`,
  )
}

export function updateCategory(
  workspaceId: number,
  categoryId: number,
  data: CategoryUpdate,
): Promise<CategoryRead> {
  return patchJson<CategoryRead>(
    `/workspaces/${workspaceId}/categories/${categoryId}`,
    data,
  )
}

export function deleteCategory(
  workspaceId: number,
  categoryId: number,
): Promise<void> {
  return del(
    `/workspaces/${workspaceId}/categories/${categoryId}`,
  )
}
