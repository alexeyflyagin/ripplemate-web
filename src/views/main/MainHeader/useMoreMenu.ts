import { createHomeMoreMenu } from '@/menu/HomeMore'
import { FONT_ICONS, THEME_ICONS } from './constants'
import type { ComposerTranslation } from 'vue-i18n'
import { useAuthStore } from '@/stores/domain/auth'
import { useAccountStore } from '@/stores/domain/account'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/domain/settings'
import type { MenuItemData } from '@/components/ui/ContextMenu'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import type { Placement } from '@floating-ui/dom'
import type { OffsetOptions } from '@floating-ui/core'
import WorkspaceDialog from '@/views/dialogs/WorkspaceDialog/WorkspaceDialog.vue'

export function useMoreMenu(t: ComposerTranslation) {
  const authStore = useAuthStore()
  const accountStore = useAccountStore()
  const workspaceStore = useWorkspaceStore()
  const overlayStore = useOverlayStore()
  const settingsStore = useSettingsStore()
  const router = useRouter()
  const { currentWorkspaceId, currentWorkspace } =
    useCurrentWorkspace()
  let overlay: OverlayHandle

  async function onItemClick(item: MenuItemData) {
    switch (item.id) {
      case 'editWorkspaceName':
        editWorkspace()
        overlay.close()
        break
      case 'deleteWorkspace':
        deleteWorkspace()
        overlay.close()
        break
      case 'font':
        await settingsStore.nextFont()
        break
      case 'language':
        await settingsStore.nextLanguage()
        break
      case 'theme':
        await settingsStore.nextTheme()
        break
      case 'logout':
        authStore.logout()
        overlay.close()
        break
    }
  }

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

    const confirmOverlay = overlayStore.open(
      ConfirmDialog,
      {
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
              params: { workspaceId: String(next.id) },
            })
          } else {
            router.push({ name: 'root' })
          }
        },
        onCancel: () => confirmOverlay.close(),
      },
    )
  }

  async function openMoreMenu(event: MouseEvent) {
    const items = computed(() =>
      createHomeMoreMenu(t, {
        font:
          settingsStore.settings?.font ??
          t('general.state.loading'),
        fontIcon: FONT_ICONS[settingsStore.settings.font],
        theme: settingsStore.settings
          ? t(
              `general.theme.${settingsStore.settings.theme}`,
            )
          : t('general.state.loading'),
        language: settingsStore.settings
          ? t(
              `general.lang.${settingsStore.settings.language}`,
            )
          : t('general.state.loading'),
        themeIcon:
          THEME_ICONS[
            settingsStore.isDark ? 'dark' : 'light'
          ],
        userDisplayName: accountStore.account
          ? accountStore.account.display_name
          : t('general.state.loading'),
        workspaceName: currentWorkspace.value?.name,
        canDeleteWorkspace:
          workspaceStore.workspaces.length > 1,
      }),
    )

    const targetHtmlEl = event.currentTarget as HTMLElement

    overlay = overlayStore.open(ContextMenu, {
      offsetOptions: {
        mainAxis: -targetHtmlEl.offsetHeight,
      } as OffsetOptions,
      targetEl: event.currentTarget,
      items: items,
      placement: 'top-end' as Placement,
      onClickItem: onItemClick,
      onClose: () => overlay.close(),
    })
  }

  return { openMoreMenu }
}
