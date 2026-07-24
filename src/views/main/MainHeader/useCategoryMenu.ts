import type { MenuItemData } from '@/components/ContextMenu/ContextMenu.types'
import { createCategoryMenu } from '@/menu/Category'
import { useCategoryStore } from '@/stores/category'
import { useContextMenuStore } from '@/stores/contextMenu'
import { getRect } from '@/utils/getRectByMouseEvent'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCategoryMenu(t: ComposerTranslation) {
  const menuStore = useContextMenuStore()
  const categoryStore = useCategoryStore()

  async function handleItemClick(item: MenuItemData) {
    switch (item.id) {
      case 'delete':
        await categoryStore.deleteCurrentCategory()
        break
      case 'edit':
        //TODO
        break
    }
  }

  function openCategoryMenu(event: MouseEvent) {
    const rect = getRect(event)

    const items = computed(() => {
      return createCategoryMenu(
        t,
        categoryStore.currentCategory?.name ??
          t('general.state.loading'),
      )
    })

    menuStore.open({
      posX: rect.right - rect.width / 2,
      posY: rect.bottom + 4,
      menuItems: items,
      menuAnchor: 'center-top',
      handler: handleItemClick,
    })
  }

  return { openCategoryMenu }
}
