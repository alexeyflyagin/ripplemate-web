import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
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
import WorkspaceDialog from '@/views/dialogs/WorkspaceDialog/WorkspaceDialog.vue'

export function useWorkspaceMenu(t: ComposerTranslation) {
  const MENU_OFFSET = 4

  const workspaceStore = useWorkspaceStore()
  const overlayStore = useOverlayStore()
  const {
    currentWorkspaceId,
    currentWorkspace,
    selectWorkspace,
  } = useCurrentWorkspace()
  let overlay: OverlayHandle

  const isMenuOpened = ref<boolean>(false)

  const currentWorkspaceName = computed(
    () =>
      currentWorkspace.value?.name ??
      t('general.action.selectWorkspace'),
  )

  async function handleItemClick(item: MenuItemData) {
    if (item.id === 'add') {
      createWorkspace()
      overlay.close()
      return
    }

    selectWorkspace(item.id)
    overlay.close()
  }

  function createWorkspace() {
    const workspaceOverlay = overlayStore.open(
      WorkspaceDialog,
      {
        onClose: () => workspaceOverlay.close(),
      },
    )
  }

  function openWorkspaceMenu(event: MouseEvent) {
    const items = computed(() => {
      return [
        ...workspaceStore.workspaces.map<MenuItemData>(
          (w) => ({
            id: `${w.id}`,
            label: w.name,
            selected: w.id === currentWorkspaceId.value,
            icon:
              w.id === currentWorkspaceId.value
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
        currentWorkspaceId.value ?? undefined,
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
