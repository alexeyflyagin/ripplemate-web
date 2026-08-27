import {
  getCategory as getCategoryApi,
  getCategories as getCategoriesApi,
  updateCategory as updateCategoryApi,
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
} from '@/api/repositories/category'
import type {
  CategoryCreate,
  CategoryRead,
  CategoryUpdate,
} from '@/api/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore(
  'category',
  () => {
    const categories = ref<CategoryRead[] | null>(null)

    function getCachedById(id: number | undefined | null) {
      if (!categories.value || !id) return undefined
      return categories.value.find((c) => c.id === id)
    }

    async function loadCategories(workspaceId: number) {
      categories.value = await getCategoriesApi(workspaceId)
    }

    function clearCategories() {
      categories.value = null
    }

    async function updateCategory(
      workspaceId: number,
      id: number,
      data: CategoryUpdate,
    ) {
      const updated = await updateCategoryApi(
        workspaceId,
        id,
        data,
      )
      if (categories.value) {
        categories.value = categories.value.map((c) =>
          c.id === id ? updated : c,
        )
      }
      return updated
    }

    async function createCategory(
      workspaceId: number,
      data: CategoryCreate,
    ) {
      if (!categories.value)
        throw new Error('Categories were not loaded')

      const created = await createCategoryApi(
        workspaceId,
        data,
      )
      categories.value.push(created)
      return created
    }

    async function deleteCategory(
      workspaceId: number,
      id: number,
    ) {
      if (!categories.value)
        throw new Error('Categories were not loaded')

      await deleteCategoryApi(workspaceId, id)
      categories.value = categories.value.filter(
        (c) => c.id !== id,
      )
    }

    async function getCategory(
      workspaceId: number,
      id: number,
    ) {
      const found = getCachedById(id)
      if (found) return found
      return await getCategoryApi(workspaceId, id)
    }

    return {
      categories,
      loadCategories,
      clearCategories,
      getCachedById,
      updateCategory,
      createCategory,
      deleteCategory,
      getCategory,
    }
  },
)
