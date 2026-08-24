import type { TabItemData } from '@/components/ui/Tabs'
import { useCategoryStore } from '@/stores/domain/category'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { createAllTab } from './factories'
import { useOverlayStore } from '@/stores/ui/overlay'
import CategoryDialog from '@/views/dialogs/CategoryDialog/CategoryDialog.vue'

export function useCategoryTabs(t: ComposerTranslation) {
  const categoryStore = useCategoryStore()
  const overlayStore = useOverlayStore()

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

  async function addCategoryClick() {
    const overlay = overlayStore.open(CategoryDialog, {
      onClose: () => overlay.close(),
    })
  }

  return {
    currentTabId,
    tabs,
    isLoading,
    addCategoryClick,
  }
}
