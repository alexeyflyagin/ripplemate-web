import { del, get, patchJson, postJson } from '../client'
import type {
  CategoryCreate,
  CategoryRead,
  CategoryUpdate,
} from '../types'

export function createCategory(
  workspaceId: string,
  data: CategoryCreate,
): Promise<CategoryRead> {
  return postJson<CategoryRead>(
    `/workspaces/${workspaceId}/categories`,
    data,
  )
}

export function getCategories(
  workspaceId: string,
): Promise<CategoryRead[]> {
  return get<CategoryRead[]>(
    `/workspaces/${workspaceId}/categories`,
  )
}

export function getCategory(
  workspaceId: string,
  categoryId: string,
): Promise<CategoryRead> {
  return get<CategoryRead>(
    `/workspaces/${workspaceId}/categories/${categoryId}`,
  )
}

export function updateCategory(
  workspaceId: string,
  categoryId: string,
  data: CategoryUpdate,
): Promise<CategoryRead> {
  return patchJson<CategoryRead>(
    `/workspaces/${workspaceId}/categories/${categoryId}`,
    data,
  )
}

export function deleteCategory(
  workspaceId: string,
  categoryId: string,
): Promise<void> {
  return del(
    `/workspaces/${workspaceId}/categories/${categoryId}`,
  )
}
