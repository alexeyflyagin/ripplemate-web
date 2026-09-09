import type { MenuItemData } from '@/components/ui/ContextMenu'
import LanguageIcon from '~icons/icons-16/language'
import LeaveIcon from '~icons/icons-16/leave'
import type { ComposerTranslation } from 'vue-i18n'
import type { Component } from 'vue'
import OledIcon from '~icons/icons-16/oled'

export interface SettingsMenuData {
  font: string
  theme: string
  language: string
  fontIcon: Component
  themeIcon: Component
  showOled: boolean
  isOled: boolean
}

export function createSettingsMenu(
  t: ComposerTranslation,
  data: SettingsMenuData,
): MenuItemData[] {
  return [
    {
      id: 'font',
      label: t('general.label.font'),
      icon: data.fontIcon,
      value: data.font,
    },
    {
      id: 'language',
      label: t('general.label.language'),
      icon: LanguageIcon,
      value: data.language,
    },
    {
      id: 'theme',
      label: t('general.label.theme'),
      icon: data.themeIcon,
      value: data.theme,
    },
    ...(data.showOled
      ? [
          {
            id: 'oled',
            label: t('general.label.oled'),
            icon: OledIcon,
            value: data.isOled
              ? t('general.state.on')
              : t('general.state.off'),
          },
        ]
      : []),
  ]
}
