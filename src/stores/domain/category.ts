import {
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
import { computed, ref, watch } from 'vue'
import { useWorkspaceStore } from '@/stores/domain/workspace'

const CURRENT_CATEGORY_ID = 'currentCategoryId'

export const useCategoryStore = defineStore(
  'category',
  () => {
    const workspaceStore = useWorkspaceStore()

    const categories = ref<CategoryRead[] | null>(null)
    const currentCategoryId = ref<number | null>(
      getStoredCategoryId(),
    )

    const currentCategory = computed<
      CategoryRead | undefined
    >(() => {
      if (!categories.value) return undefined

      return categories.value.find(
        (w) => w.id === currentCategoryId.value,
      )
    })

    watch(
      () => workspaceStore.currentWorkspace,
      async (w) => {
        if (!w) {
          categories.value = null
          return
        }
        categories.value = await getCategoriesApi(w.id)

        if (
          currentCategoryId.value &&
          !currentCategory.value
        ) {
          changeCurrentCategory(null)
        }
      },
      { immediate: true },
    )

    function getStoredCategoryId(): number | null {
      const stored = localStorage.getItem(
        CURRENT_CATEGORY_ID,
      )
      if (stored === null) return null
      const parsed = Number(stored)
      return isNaN(parsed) ? null : parsed
    }

    function changeCurrentCategory(id: number | null) {
      if (id !== null) {
        if (
          !categories.value ||
          categories.value.length === 0 ||
          !categories.value.some((c) => c.id === id)
        )
          throw new Error('Category was not found')
      }

      currentCategoryId.value = id

      if (id === null) {
        localStorage.removeItem(CURRENT_CATEGORY_ID)
      } else {
        localStorage.setItem(
          CURRENT_CATEGORY_ID,
          String(id),
        )
      }
    }

    async function updateCurrentCategory(
      data: CategoryUpdate,
    ) {
      if (!workspaceStore.currentWorkspaceId)
        throw new Error('No current workspace selected')
      if (
        !currentCategoryId.value ||
        !categories.value ||
        categories.value.length === 0
      )
        throw new Error('No current category selected')

      const updatedCategory = await updateCategoryApi(
        workspaceStore.currentWorkspaceId,
        currentCategoryId.value,
        data,
      )

      categories.value = categories.value.map((c) =>
        c.id === currentCategoryId.value
          ? updatedCategory
          : c,
      )
    }

    async function createCategory(data: CategoryCreate) {
      if (!workspaceStore.currentWorkspaceId)
        throw new Error('No workspace selected')
      if (!categories.value)
        throw new Error('Categories were not loaded')

      const createdCategory = await createCategoryApi(
        workspaceStore.currentWorkspaceId,
        data,
      )
      categories.value.push(createdCategory)
      changeCurrentCategory(createdCategory.id)
    }

    async function deleteCategory(id: number) {
      if (!workspaceStore.currentWorkspaceId)
        throw new Error('No workspace selected')
      if (!categories.value)
        throw new Error('Categories were not loaded')

      const deletedIndex = categories.value.findIndex(
        (c) => c.id === id,
      )

      await deleteCategoryApi(
        workspaceStore.currentWorkspaceId,
        id,
      )

      categories.value = categories.value.filter(
        (c) => c.id !== id,
      )

      if (id === currentCategoryId.value) {
        const nextIndex =
          deletedIndex - 1 < 0 ? null : deletedIndex - 1
        const nextCategory =
          nextIndex !== null
            ? categories.value[nextIndex]
            : null

        changeCurrentCategory(
          nextCategory ? nextCategory.id : null,
        )
      }
    }

    async function deleteCurrentCategory() {
      if (!currentCategoryId.value)
        throw new Error('No category selected')

      await deleteCategory(currentCategoryId.value)
    }

    return {
      categories,
      currentCategoryId,
      currentCategory,
      changeCurrentCategory,
      updateCurrentCategory,
      createCategory,
      deleteCurrentCategory,
      deleteCategory,
    }
  },
)
