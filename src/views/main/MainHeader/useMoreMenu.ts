import { createHomeMoreMenu } from '@/menu/HomeMore'
import { FONT_ICONS, THEME_ICONS } from './constants'
import { resolveTheme } from '@/composables/useTheme'
import type { ComposerTranslation } from 'vue-i18n'
import { useAuthStore } from '@/stores/domain/auth'
import { getRect } from '@/utils/getRectByMouseEvent'
import { useAccountStore } from '@/stores/domain/account'
import { useWorkspaceStore } from '@/stores/domain/workspace'
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

export function useMoreMenu(t: ComposerTranslation) {
  const router = useRouter()
  const authStore = useAuthStore()
  const accountStore = useAccountStore()
  const workspaceStore = useWorkspaceStore()
  const overlayStore = useOverlayStore()
  const settingsStore = useSettingsStore()
  let overlay: OverlayHandle

  async function onItemClick(item: MenuItemData) {
    switch (item.id) {
      case 'editWorkspaceName':
        overlay.close
        //TODO
        break
      case 'deleteWorkspace':
        deleteWorkspace()
        overlay.close
        break
      case 'font':
        await settingsStore.nextFont()
        return false
      case 'language':
        await settingsStore.nextLanguage()
        return false
      case 'theme':
        await settingsStore.nextTheme()
        return false
      case 'logout':
        await authStore.logout()
        overlay.close
        router.push({ name: 'login' })
        break
    }
    return true
  }

  async function deleteWorkspace() {
    const workspace = workspaceStore.currentWorkspace
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
          await workspaceStore.deleteCurrentWorkspace()
          confirmOverlay.close()
        },
        onCancel: () => confirmOverlay.close(),
      },
    )
  }

  async function openMoreMenu(event: MouseEvent) {
    const rect = getRect(event)

    const items = computed(() =>
      createHomeMoreMenu(t, {
        font:
          settingsStore.settings?.font ??
          t('general.state.loading'),
        fontIcon: settingsStore.settings
          ? FONT_ICONS[settingsStore.settings?.font]
          : FONT_ICONS['sans-serif'],
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
        themeIcon: settingsStore.settings
          ? THEME_ICONS[
              resolveTheme(settingsStore.settings.theme)
            ]
          : THEME_ICONS['light'],
        userDisplayName: accountStore.account
          ? accountStore.account.display_name
          : t('general.state.loading'),
        workspaceName:
          workspaceStore.currentWorkspace?.name,
        canDeleteWorkspace:
          workspaceStore.workspaces.length > 1,
      }),
    )

    overlay = overlayStore.open(ContextMenu, {
      x: rect.right,
      y: rect.top,
      items: items,
      anchor: 'right-top',
      onClickItem: onItemClick,
      onClose: () => overlay.close(),
    })
  }

  return { openMoreMenu }
}
