import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import { getRect } from '@/utils/getRectByMouseEvent'
import { computed, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { createAddWorkspaceMenuItem } from './factories'
import TickIcon from '~icons/icons-16/tick'
import { useOverlayStore } from '@/stores/ui/overlay'

export function useWorkspaceMenu(t: ComposerTranslation) {
  const workspaceStore = useWorkspaceStore()
  const overlayStore = useOverlayStore()
  let overlayId: string

  const isMenuOpened = ref<boolean>(false)

  const currentWorkspaceName = computed(
    () =>
      workspaceStore.currentWorkspace?.name ??
      t('general.action.selectWorkspace'),
  )

  async function handleItemClick(item: MenuItemData) {
    if (item.id === 'add') {
      await workspaceStore.createWorkspace({
        name: `Workspace ${workspaceStore.workspaces.length + 1}`,
      })
      closeMenu()
      return
    }

    const itemId = Number(item.id)
    if (isNaN(itemId)) return
    workspaceStore.changeCurrentWorkspace(itemId)
    closeMenu()
  }

  function closeMenu() {
    overlayStore.close(overlayId)
    isMenuOpened.value = false
  }

  function openWorkspaceMenu(event: MouseEvent) {
    const rect = getRect(event)

    const items = computed(() => {
      return [
        ...workspaceStore.workspaces.map<MenuItemData>(
          (w) => ({
            id: `${w.id}`,
            label: w.name,
            selected:
              w.id === workspaceStore.currentWorkspaceId,
            icon:
              w.id === workspaceStore.currentWorkspaceId
                ? TickIcon
                : undefined,
          }),
        ),
        createAddWorkspaceMenuItem(
          t,
          workspaceStore.workspaces.length > 0,
        ),
      ]
    })

    overlayId = overlayStore.open(ContextMenu, {
      x: rect.left,
      y: rect.bottom + 4,
      anchor: 'left-top',
      items: items,
      onClickItem: handleItemClick,
      onClose: closeMenu,
    })
  }

  return {
    isMenuOpened,
    currentWorkspaceName,
    openWorkspaceMenu,
  }
}
