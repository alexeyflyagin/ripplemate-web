import type { TabItemData } from '@/components/Tabs/BaseTabs.types'
import { useCategoryStore } from '@/stores/category'
import { computed, nextTick, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { createAllTab } from './factories'

export function useCategoryTabs(t: ComposerTranslation) {
  const categoryStore = useCategoryStore()

  const currentTabId = computed<string>({
    get() {
      return categoryStore.currentCategoryId
        ? categoryStore.currentCategoryId.toString()
        : 'all'
    },
    set(id) {
      let categoryId: number | null = Number(id)
      if (isNaN(categoryId)) categoryId = null
      categoryStore.changeCurrentCategory(categoryId)
    },
  })

  const isLoading = computed<boolean>(() => {
    return categoryStore.categories === null
  })

  const tabs = computed<TabItemData[]>(() => {
    if (!categoryStore.categories) return []
    return [
      createAllTab(t),
      ...categoryStore.categories.map<TabItemData>((c) => {
        return {
          id: c.id.toString(),
          label: c.name,
          selectable: true,
        }
      }),
    ]
  })

  async function addCategoryClick(
    event: MouseEvent,
    activeId: string,
  ) {
    await categoryStore.createCategory({
      name: `Category ${Math.round(Math.random() * 10000)}`,
    })
  }

  return {
    currentTabId,
    tabs,
    isLoading,
    addCategoryClick,
  }
}
