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
import { useOverlayStore } from '@/stores/ui/overlay'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { truncate } from '@/utils/truncate'

export function useMoreMenu(t: ComposerTranslation) {
  const router = useRouter()
  const authStore = useAuthStore()
  const accountStore = useAccountStore()
  const workspaceStore = useWorkspaceStore()
  const overlayStore = useOverlayStore()
  const settingsStore = useSettingsStore()
  let overlayId: string

  async function onItemClick(item: MenuItemData) {
    switch (item.id) {
      case 'editWorkspaceName':
        overlayStore.close(overlayId)
        //TODO
        break
      case 'deleteWorkspace':
        deleteWorkspace()
        overlayStore.close(overlayId)
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
        overlayStore.close(overlayId)
        router.push({ name: 'login' })
        break
    }
    return true
  }

  async function deleteWorkspace() {
    const workspace = workspaceStore.currentWorkspace
    if (!workspace) return

    const confirmOverlayId = overlayStore.open(
      ConfirmDialog,
      {
        title: t('dialog.workspace.delete.title'),
        caption: t('dialog.workspace.delete.caption', {
          name: `<strong>${workspace.name}</strong>`,
        }),
        confirm: t('general.action.delete'),
        cancel: t('general.action.cancel'),
        onConfirm: async () => {
          await workspaceStore.deleteCurrentWorkspace()
          overlayStore.close(confirmOverlayId)
        },
        onCancel: () =>
          overlayStore.close(confirmOverlayId),
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

    overlayId = overlayStore.open(ContextMenu, {
      x: rect.right,
      y: rect.top,
      items: items,
      anchor: 'right-top',
      onClickItem: onItemClick,
      onClose: () => overlayStore.close(overlayId),
    })
  }

  return { openMoreMenu }
}
