import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { createWorkspaceMoreMenu } from '@/menu/WorkspaceMoreMenu'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import WorkspaceDialog from '@/views/dialogs/WorkspaceDialog/WorkspaceDialog.vue'
import type { OffsetOptions } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { useRouter } from 'vue-router'

export function useWorkspaceMoreMenu(t: ComposerTranslation) {
  const workspaceStore = useWorkspaceStore()
  const overlayStore = useOverlayStore()
  const router = useRouter()
  const { currentWorkspaceId, currentWorkspace } =
    useCurrentWorkspace()
  let overlay: OverlayHandle

  function editWorkspace() {
    const workspaceOverlay = overlayStore.open(
      WorkspaceDialog,
      {
        workspaceId: currentWorkspaceId.value,
        onClose: () => workspaceOverlay.close(),
      },
    )
  }

  async function deleteWorkspace() {
    const workspace = currentWorkspace.value
    if (!workspace) return

    const confirmOverlay = overlayStore.open(ConfirmDialog, {
      title: t('dialog.workspace.delete.title'),
      caption: t('dialog.workspace.delete.caption', {
        name: `<strong>${workspace.name}</strong>`,
      }),
      type: 'destructive',
      confirm: t('general.action.delete'),
      onConfirm: async () => {
        await workspaceStore.deleteWorkspace(workspace.id)
        confirmOverlay.close()

        const next = workspaceStore.workspaces[0]
        if (next) {
          router.push({
            name: 'library',
            params: { workspaceId: next.id },
          })
        } else {
          router.push({ name: 'root' })
        }
      },
      onCancel: () => confirmOverlay.close(),
    })
  }

  function onClickItem(item: MenuItemData) {
    switch (item.id) {
      case 'editWorkspaceName':
        editWorkspace()
        overlay.close()
        break
      case 'deleteWorkspace':
        deleteWorkspace()
        overlay.close()
        break
    }
  }

  function openMenu(event: MouseEvent | KeyboardEvent) {
    const items = computed(() =>
      createWorkspaceMoreMenu(t, {
        canDeleteWorkspace:
          workspaceStore.workspaces.length > 1,
      }),
    )

    const targetHtmlEl = event.currentTarget as HTMLElement

    overlay = overlayStore.open(ContextMenu, {
      targetEl: event.currentTarget,
      offsetOptions: {
        mainAxis: -targetHtmlEl.offsetHeight,
      } as OffsetOptions,
      placement: 'bottom-end' as Placement,
      items,
      onClickItem,
      onClose: () => overlay.close(),
    })
  }

  return { openMenu }
}
