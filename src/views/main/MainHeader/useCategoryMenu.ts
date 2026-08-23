import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { createCategoryMenu } from '@/menu/Category'
import { useCategoryStore } from '@/stores/domain/category'
import { useOverlayStore } from '@/stores/ui/overlay'
import { getRect } from '@/utils/getRectByMouseEvent'
import { computed, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCategoryMenu(t: ComposerTranslation) {
  const categoryStore = useCategoryStore()
  const overlayStore = useOverlayStore()
  const selectedId = ref<string | undefined>()
  let overlayId: string

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
        onCloseMenu()
        break
      case 'delete':
        await categoryStore.deleteCategory(categoryId)
        onCloseMenu()
        break
    }
  }

  function onCloseMenu() {
    overlayStore.close(overlayId)
    selectedId.value = undefined
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

    overlayId = overlayStore.open(ContextMenu, {
      x: rect.left + rect.width / 2,
      y: rect.bottom + 4,
      items: menuItems,
      anchor: 'center-top',
      payload: categoryId.toString(),
      onClickItem: handleMenuClick,
      onClose: onCloseMenu,
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
