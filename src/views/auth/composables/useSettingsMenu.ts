import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { FONT_ICONS, THEME_ICONS } from '@/constants/icons'
import { createSettingsMenu } from '@/menu/SettingsMenu'
import { useSettingsStore } from '@/stores/domain/settings'
import { useOverlayStore } from '@/stores/ui/overlay'
import type { OffsetOptions } from '@floating-ui/core'
import type { Placement } from '@floating-ui/dom'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useSettingsMenu(t: ComposerTranslation) {
  const settingsStore = useSettingsStore()
  const overlayStore = useOverlayStore()

  async function onItemClick(item: MenuItemData) {
    switch (item.id) {
      case 'font':
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
    }
  }

  function open(event: Event) {
    const target = event.currentTarget as HTMLElement

    const items = computed<MenuItemData[]>(() => {
      return createSettingsMenu(t, {
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
      })
    })

    const overlay = overlayStore.open(ContextMenu, {
      targetEl: target,
      items: items,
      placement: 'bottom' as Placement,
      offsetOptions: {
        mainAxis: -target.offsetHeight,
      } as OffsetOptions,
      onClickItem: onItemClick,
      onClose: () => overlay.close(),
    })
  }

  return { open }
}
