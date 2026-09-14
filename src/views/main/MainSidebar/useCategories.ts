import { computed, readonly, ref, watch } from 'vue'
import type { CategoryItemData } from './CategoryItem.types'
import { useCategoryStore } from '@/stores/domain/category'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import type { ComposerTranslation } from 'vue-i18n'
import {
  ALL_CATEGORY_ID,
  createAllCategoryItemData,
} from './factories'
import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import type {
  OffsetOptions,
  Placement,
} from '@floating-ui/dom'
import { createCategoryMenu } from '@/menu/CategoryMenu'
import CategoryDialog from '@/views/dialogs/CategoryDialog/CategoryDialog.vue'

export function useCategories(t: ComposerTranslation) {
  const categoryStore = useCategoryStore()
  const overlayStore = useOverlayStore()
  const {
    currentCategoryId: currentCategoryIdRaw,
    selectCategory: selectCategoryRaw,
  } = useCurrentCategory()
  const { currentWorkspaceId } = useCurrentWorkspace()
  let overlay: OverlayHandle
  const selectedId = ref<string | undefined>()

  const currentCategoryId = computed<string>(() => {
    return currentCategoryIdRaw.value ?? ALL_CATEGORY_ID
  })

  const categories = computed<CategoryItemData[]>(() => {
    return [
      createAllCategoryItemData(t),

      ...(categoryStore.categories?.map<CategoryItemData>(
        (v) => {
          return {
            id: v.id,
            label: v.name,
          }
        },
      ) ?? []),
    ]
  })

  function selectCategory(id: string) {
    selectCategoryRaw(
      id === ALL_CATEGORY_ID ? undefined : id,
    )
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

  function openMenu(
    event: MouseEvent | KeyboardEvent,
    categoryId: string,
  ) {
    if (!categoryStore.categories) return

    const category = categoryStore.categories.find(
      (c) => c.id === categoryId,
    )
    if (!category) return

    const menuItems = computed(() =>
      createCategoryMenu(t, category.name),
    )

    selectedId.value = categoryId
    const row = event.currentTarget as HTMLElement

    overlay = overlayStore.open(ContextMenu, {
      targetEl: event.currentTarget,
      items: menuItems,
      payload: categoryId,
      offsetOptions: {
        mainAxis: 4,
        crossAxis: 2,
      } as OffsetOptions,
      placement: 'bottom-end' as Placement,
      onClickItem: handleMenuClick,
      onClose: () => overlay.close(),
    })

    const stop = watch(overlay.isOpen, (v) => {
      if (v) return
      selectedId.value = undefined
      stop()
    })
  }

  function onTabContextMenu(
    event: MouseEvent | KeyboardEvent,
    id: string,
  ) {
    if (id === ALL_CATEGORY_ID) return
    openMenu(event, id)
  }

  async function addCategoryClick() {
    const addOverlay = overlayStore.open(CategoryDialog, {
      onClose: () => addOverlay.close(),
    })
  }

  return {
    selectedId: readonly(selectedId),
    categories: readonly(categories),
    currentCategoryId: readonly(currentCategoryId),
    selectCategory,
    onTabContextMenu,
    addCategoryClick,
  }
}
