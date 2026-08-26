import type { TabItemData } from '@/components/ui/Tabs'
import { useCategoryStore } from '@/stores/domain/category'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { createAllTab } from './factories'
import { useOverlayStore } from '@/stores/ui/overlay'
import CategoryDialog from '@/views/dialogs/CategoryDialog/CategoryDialog.vue'

export function useCategoryTabs(t: ComposerTranslation) {
  const categoryStore = useCategoryStore()
  const overlayStore = useOverlayStore()
  const { currentCategoryId, selectCategory } =
    useCurrentCategory()

  const currentTabId = computed<string>({
    get() {
      return currentCategoryId.value
        ? currentCategoryId.value.toString()
        : 'all'
    },
    set(id) {
      const categoryId = Number(id)
      selectCategory(
        isNaN(categoryId) ? undefined : categoryId,
      )
    },
  })

  const isLoading = computed<boolean>(
    () => categoryStore.categories === null,
  )

  const tabs = computed<TabItemData[]>(() => {
    if (!categoryStore.categories) return []
    return [
      createAllTab(t),
      ...categoryStore.categories.map<TabItemData>((c) => ({
        id: c.id.toString(),
        label: c.name,
        selectable: true,
      })),
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
