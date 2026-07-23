import { useCategoryStore } from '@/stores/category'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { createAllTab } from './factories'
import type { Tab } from '@/components/Tabs/CategoryTabs/CategoryTab.types'

export function useCategoryTabs(t: ComposerTranslation) {
  const categoryStore = useCategoryStore()

  const tabs = computed<Tab[]>(() => [
    createAllTab(t),
    ...(categoryStore.categories?.map((c) => ({
      value: c.id,
      label: c.name,
      clickable: true,
    })) ?? []),
  ])

  const currentTab = computed<number>({
    get: () => {
      if (categoryStore.currentCategoryId === null) return 0
      const index =
        categoryStore.categories?.findIndex(
          (c) => c.id === categoryStore.currentCategoryId,
        ) ?? -1
      return index !== -1 ? index + 1 : 0
    },
    set: (value) => {
      const category =
        value === 0
          ? null
          : categoryStore.categories?.[value - 1]
      categoryStore.changeCurrentCategory(
        category?.id ?? null,
      )
    },
  })

  return { tabs, currentTab }
}
