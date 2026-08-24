import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import { computed, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { createAddWorkspaceMenuItem } from './factories'
import TickIcon from '~icons/icons-16/tick'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import type { Placement } from '@floating-ui/dom'
import type { OffsetOptions } from '@floating-ui/core'

export function useWorkspaceMenu(t: ComposerTranslation) {
  const MENU_OFFSET = 4

  const workspaceStore = useWorkspaceStore()
  const overlayStore = useOverlayStore()
  let overlay: OverlayHandle

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
      overlay.close()
      return
    }

    const itemId = Number(item.id)
    if (isNaN(itemId)) return
    workspaceStore.changeCurrentWorkspace(itemId)
    overlay.close()
  }

  function openWorkspaceMenu(event: MouseEvent) {
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

    overlay = overlayStore.open(ContextMenu, {
      offsetOptions: {
        mainAxis: MENU_OFFSET,
      } as OffsetOptions,
      targetEl: event.currentTarget,
      anchor: 'left-top',
      items: items,
      placemet: 'bottom-start' as Placement,
      initialScrollToId:
        workspaceStore.currentWorkspaceId?.toString() ??
        undefined,
      onClickItem: handleItemClick,
      onClose: () => overlay.close(),
    })

    const stop = watch(overlay.isOpen, (v) => {
      if (v) return
      isMenuOpened.value = false
      stop()
    })
  }

  return {
    isMenuOpened,
    currentWorkspaceName,
    openWorkspaceMenu,
  }
}
