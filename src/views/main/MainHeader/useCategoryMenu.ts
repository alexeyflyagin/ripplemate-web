import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { createCategoryMenu } from '@/menu/CategoryMenu'
import { useCategoryStore } from '@/stores/domain/category'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import CategoryDialog from '@/views/dialogs/CategoryDialog/CategoryDialog.vue'
import type { OffsetOptions } from '@floating-ui/core'
import type { Placement } from '@floating-ui/dom'
import { computed, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

const RESERVED_TAB_IDS = ['all', 'add']

export function useCategoryMenu(t: ComposerTranslation) {
  const MENU_OFFSET = 4

  const { currentCategoryId } = useCurrentCategory()
  const { currentWorkspaceId } = useCurrentWorkspace()
  const categoryStore = useCategoryStore()
  const overlayStore = useOverlayStore()
  const selectedId = ref<string | undefined>()
  let overlay: OverlayHandle

  function isCategoryId(id: string): boolean {
    return !RESERVED_TAB_IDS.includes(id)
  }

  async function handleMenuClick(
    item: MenuItemData,
    payload?: string,
  ) {
    if (!payload) return

    switch (item.id) {
      case 'edit':
        editCategory(payload)
        overlay.close()
        break
      case 'delete':
        deleteCategory(payload)
        overlay.close()
        break
    }
  }

  async function deleteCategory(categoryId: string) {
    const category = await categoryStore.getCategory(
      currentWorkspaceId.value!,
      categoryId,
    )

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
          await categoryStore.deleteCategory(
            currentWorkspaceId.value!,
            categoryId,
          )
          confirmOverlayId.close()
        },
        onCancel: () => confirmOverlayId.close(),
      },
    )
  }

  async function editCategory(categoryId: string) {
    const editOverlay = overlayStore.open(CategoryDialog, {
      categoryId: categoryId,
      onClose: () => editOverlay.close(),
    })
  }

  function openMenu(event: MouseEvent, categoryId: string) {
    if (!categoryStore.categories) return

    const category = categoryStore.categories.find(
      (c) => c.id === categoryId,
    )
    if (!category) return

    const menuItems = computed(() =>
      createCategoryMenu(t, category.name),
    )

    selectedId.value = categoryId

    overlay = overlayStore.open(ContextMenu, {
      targetEl: event.currentTarget,
      items: menuItems,
      payload: categoryId,
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
    if (!isCategoryId(id)) return
    if (currentCategoryId.value !== id) return
    openMenu(event, id)
  }

  function onTabContextMenu(event: MouseEvent, id: string) {
    if (!isCategoryId(id)) return
    openMenu(event, id)
  }

  return { selectedId, onTabClick, onTabContextMenu }
}
