import type { MenuItemData } from '@/components/ui/ContextMenu'
import type { Component } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import ProfileIcon from '~icons/icons-16/profile'
import LanguageIcon from '~icons/icons-16/language'
import LeaveIcon from '~icons/icons-16/leave'
import OledIcon from '~icons/icons-16/oled'

export interface ProfileMenuData {
  userDisplayName: string
  font: string
  theme: string
  language: string
  fontIcon: Component
  themeIcon: Component
  showOled: boolean
  isOled: boolean
}

export function createProfileMenu(
  t: ComposerTranslation,
  data: ProfileMenuData,
): MenuItemData[] {
  return [
    {
      id: 'logout',
      label: t('general.action.logout'),
      icon: LeaveIcon,
      color: 'danger',
    },
    {
      id: 'fontStyle',
      label: t('general.label.font'),
      icon: data.fontIcon,
      value: data.font,
      showDivider: true,
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
    {
      id: 'profile',
      label: data.userDisplayName,
      icon: ProfileIcon,
      disabled: true,
      showDivider: true,
    },
  ]
}
