import { createMainMoreMenu } from '@/menu/MainMoreMenu'
import type { ComposerTranslation } from 'vue-i18n'
import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { useCardStore } from '@/stores/domain/card'
import { useCategoryStore } from '@/stores/domain/category'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import CategoryDialog from '@/views/dialogs/CategoryDialog/CategoryDialog.vue'
import type { OffsetOptions, Placement } from '@floating-ui/dom'
import { computed, ref } from 'vue'

export function useMoreMenu(t: ComposerTranslation) {
  const overlayStore = useOverlayStore()
  const categoryStore = useCategoryStore()
  const cardStore = useCardStore()
  const { currentWorkspaceId } = useCurrentWorkspace()
  const { currentCategoryId, currentCategory } =
    useCurrentCategory()
  let overlay: OverlayHandle

  const isRefreshing = ref<boolean>(false)

  async function refresh() {
    const workspaceId = currentWorkspaceId.value
    if (!workspaceId) return

    isRefreshing.value = true
    try {
      await cardStore.loadCards(
        workspaceId,
        currentCategoryId.value ?? null,
      )
    } finally {
      isRefreshing.value = false
    }
  }

  function editCategory() {
    const categoryId = currentCategoryId.value
    if (!categoryId) return

    const editOverlay = overlayStore.open(CategoryDialog, {
      categoryId,
      onClose: () => editOverlay.close(),
    })
  }

  async function deleteCategory() {
    const workspaceId = currentWorkspaceId.value
    const categoryId = currentCategoryId.value
    if (!workspaceId || !categoryId) return

    const category = await categoryStore.getCategory(
      workspaceId,
      categoryId,
    )

    const confirmOverlay = overlayStore.open(ConfirmDialog, {
      title: t('dialog.category.delete.title'),
      caption: t('dialog.category.delete.caption', {
        name: `<strong>${category.name}</strong>`,
      }),
      type: 'destructive',
      confirm: t('general.action.delete'),
      onConfirm: async () => {
        await categoryStore.deleteCategory(
          workspaceId,
          categoryId,
        )
        confirmOverlay.close()
      },
      onCancel: () => confirmOverlay.close(),
    })
  }

  function onItemClick(item: MenuItemData) {
    switch (item.id) {
      case 'refresh':
        overlay.close()
        refresh()
        break
      case 'edit':
        editCategory()
        overlay.close()
        break
      case 'delete':
        deleteCategory()
        overlay.close()
        break
    }
  }

  function openMoreMenu(event: MouseEvent) {
    const items = computed(() =>
      createMainMoreMenu(t, {
        categoryName:
          currentCategory.value?.name ??
          t('general.label.all'),
        canManageCategory: !!currentCategory.value,
      }),
    )

    const targetHtmlEl = event.currentTarget as HTMLElement

    overlay = overlayStore.open(ContextMenu, {
      offsetOptions: {
        mainAxis: -targetHtmlEl.offsetHeight,
      } as OffsetOptions,
      targetEl: event.currentTarget,
      placement: 'top-end' as Placement,
      items,
      onClickItem: onItemClick,
      onClose: () => overlay.close(),
    })
  }

  return { openMoreMenu, isRefreshing }
}
