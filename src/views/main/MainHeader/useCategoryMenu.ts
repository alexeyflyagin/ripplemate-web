import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { createCategoryMenu } from '@/menu/Category'
import { useCategoryStore } from '@/stores/domain/category'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import CategoryDialog from '@/views/dialogs/CategoryDialog/CategoryDialog.vue'
import type { OffsetOptions } from '@floating-ui/core'
import type { Placement } from '@floating-ui/dom'
import { computed, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCategoryMenu(t: ComposerTranslation) {
  const MENU_OFFSET = 4

  const categoryStore = useCategoryStore()
  const overlayStore = useOverlayStore()
  const selectedId = ref<string | undefined>()
  let overlay: OverlayHandle

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
        editCategory(categoryId)
        overlay.close()
        break
      case 'delete':
        deleteCategory(categoryId)
        overlay.close()
        break
    }
  }

  async function deleteCategory(categoryId: number) {
    const category =
      await categoryStore.getCategory(categoryId)

    const confirmOverlayId = overlayStore.open(
      ConfirmDialog,
      {
        title: t('dialog.category.delete.title'),
        caption: t('dialog.category.delete.caption', {
          name: `<strong>${category.name}</strong>`,
        }),
        type: 'destructive',
        confirm: t('general.action.delete'),
        onConfirm: async () => {
          await categoryStore.deleteCategory(categoryId)
          confirmOverlayId.close()
        },
        onCancel: () => confirmOverlayId.close(),
      },
    )
  }

  async function editCategory(categoryId: number) {
    const editOverlay = overlayStore.open(CategoryDialog, {
      categoryId: categoryId,
      onClose: () => editOverlay.close(),
    })
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

    selectedId.value = categoryId.toString()

    overlay = overlayStore.open(ContextMenu, {
      targetEl: event.currentTarget,
      items: menuItems,
      payload: categoryId.toString(),
      placement: 'bottom' as Placement,
      offsetOptions: {
        mainAxis: MENU_OFFSET,
      } as OffsetOptions,
      onClickItem: handleMenuClick,
      onClose: () => overlay.close(),
    })

    const stop = watch(overlay.isOpen, (v) => {
      if (v) return
      selectedId.value = undefined
      stop()
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
