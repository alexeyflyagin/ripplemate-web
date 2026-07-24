import { createHomeMoreMenu } from '@/menu/HomeMore'
import { FONT_ICONS, THEME_ICONS } from './constants'
import { resolveTheme } from '@/composables/useTheme'
import type { ComposerTranslation } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { getRect } from '@/utils/getRectByMouseEvent'
import { useAccountStore } from '@/stores/account'
import { useWorkspaceStore } from '@/stores/workspace'
import { computed } from 'vue'
import { useContextMenuStore } from '@/stores/contextMenu'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import type { MenuItemData } from '@/components/ContextMenu/ContextMenu.types'

export function useMoreMenu(t: ComposerTranslation) {
  const router = useRouter()
  const authStore = useAuthStore()
  const accountStore = useAccountStore()
  const workspaceStore = useWorkspaceStore()
  const menuStore = useContextMenuStore()
  const settingsStore = useSettingsStore()

  async function onItemClick(item: MenuItemData) {
    switch (item.id) {
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
        router.push({ name: 'login' })
        break
    }
    return true
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
        workspaceName: workspaceStore.currentWorkspace
          ? workspaceStore.currentWorkspace.name
          : t('general.state.loading'),
      }),
    )

    menuStore.open({
      posX: rect.right,
      posY: rect.top,
      menuItems: items,
      menuAnchor: 'right-top',
      handler: onItemClick,
    })
  }

  return { openMoreMenu }
}
