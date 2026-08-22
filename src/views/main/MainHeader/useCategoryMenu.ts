import type { MenuItemData } from '@/components/ui/ContextMenu'
import { createCategoryMenu } from '@/menu/Category'
import { useCategoryStore } from '@/stores/domain/category'
import { useContextMenuStore } from '@/stores/ui/contextMenu'
import { getRect } from '@/utils/getRectByMouseEvent'
import { computed, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCategoryMenu(t: ComposerTranslation) {
  const categoryStore = useCategoryStore()
  const menuStore = useContextMenuStore()
  const selectedId = ref<string | undefined>()

  function isId(id: string): boolean {
    const categoryId = Number(id)
    return !isNaN(categoryId)
  }

  async function handleMenuClick(
    item: MenuItemData,
    payload?: string,
  ) {
    const categoryId = Number(payload)
    if (isNaN(categoryId)) return

    switch (item.id) {
      case 'edit':
        // TODO
        break
      case 'delete':
        await categoryStore.deleteCategory(categoryId)
        break
    }
  }

  function openMenu(event: MouseEvent, categoryId: number) {
    if (!categoryStore.categories) return

    const category = categoryStore.categories.find(
      (c) => c.id === categoryId,
    )
    if (!category) return

    const menuItems = computed(() =>
      createCategoryMenu(t, category.name),
    )

    const rect = getRect(event)

    selectedId.value = categoryId.toString()

    const stopWatch = watch(
      () => menuStore.isOpened,
      (value) => {
        if (value) return
        selectedId.value = undefined
        stopWatch()
      },
    )

    menuStore.open({
      posX: rect.left + rect.width / 2,
      posY: rect.bottom + 4,
      menuItems: menuItems,
      menuAnchor: 'center-top',
      payload: categoryId.toString(),
      handler: handleMenuClick,
    })
  }

  function onTabClick(event: MouseEvent, id: string) {
    if (!isId(id)) return
    const categoryId = Number(id)
    if (categoryStore.currentCategoryId !== categoryId)
      return
    openMenu(event, categoryId)
  }

  function onTabContextMenu(event: MouseEvent, id: string) {
    if (!isId(id)) return
    const categoryId = Number(id)
    openMenu(event, categoryId)
  }

  return { selectedId, onTabClick, onTabContextMenu }
}
