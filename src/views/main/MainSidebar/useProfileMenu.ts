import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { FONT_ICONS, THEME_ICONS } from '@/constants/icons'
import { createProfileMenu } from '@/menu/ProfileMenu'
import { useAccountStore } from '@/stores/domain/account'
import { useAuthStore } from '@/stores/domain/auth'
import { useSettingsStore } from '@/stores/domain/settings'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import type { OffsetOptions } from '@floating-ui/dom'
import { computed, readonly } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useProfileMenu(t: ComposerTranslation) {
  const accountStore = useAccountStore()
  const settingsStore = useSettingsStore()
  const overlayStore = useOverlayStore()
  const authStore = useAuthStore()
  let overlay: OverlayHandle

  const userName = computed<string>(() => {
    return accountStore.account?.display_name ?? '-'
  })

  async function onClickItem(item: MenuItemData) {
    switch (item.id) {
      case 'fontStyle':
        await settingsStore.nextFont()
        break
      case 'language':
        await settingsStore.nextLanguage()
        break
      case 'theme':
        settingsStore.nextTheme()
        break
      case 'oled':
        settingsStore.toggleOled()
        break
      case 'logout':
        authStore.logout()
        overlay.close()
        break
    }
  }

  function openMenu(event: MouseEvent | KeyboardEvent) {
    const targetEl = event.currentTarget

    const items = computed<MenuItemData[]>(() => {
      return createProfileMenu(t, {
        font: settingsStore.font,
        fontIcon: FONT_ICONS[settingsStore.font],
        theme: t(`general.theme.${settingsStore.theme}`),
        language: t(
          `general.lang.${settingsStore.language}`,
        ),
        themeIcon:
          THEME_ICONS[
            settingsStore.isDark ? 'dark' : 'light'
          ],
        showOled: settingsStore.isDark,
        isOled: settingsStore.isOled,
        userDisplayName: accountStore.account
          ? accountStore.account.display_name
          : t('general.state.loading'),
      })
    })

    overlay = overlayStore.open(ContextMenu, {
      targetEl,
      offsetOptions: {
        mainAxis: -40,
      } as OffsetOptions,
      items,
      onClickItem,
      onClose: () => overlay.close(),
    })
  }

  return { userName: readonly(userName), openMenu }
}
