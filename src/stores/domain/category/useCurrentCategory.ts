import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from './index'

export function useCurrentCategory() {
  const route = useRoute()
  const router = useRouter()
  const categoryStore = useCategoryStore()

  const currentCategoryId = computed<number | undefined>(
    () => {
      const id = Number(route.query.category)
      return id && categoryStore.findCategoryById(id)
        ? id
        : undefined
    },
  )

  const currentCategory = computed(() =>
    categoryStore.findCategoryById(currentCategoryId.value),
  )

  function selectCategory(id: number | undefined) {
    const query = { ...route.query }
    if (id) {
      query.category = String(id)
    } else {
      delete query.category
    }
    router.replace({ query })
  }

  return {
    currentCategoryId,
    currentCategory,
    selectCategory,
  }
}
