import type { MenuItemData } from '@/components/ui/ContextMenu'
import ProfileIcon from '~icons/icons-16/profile'
import EditIcon from '~icons/icons-16/edit'
import LanguageIcon from '~icons/icons-16/language'
import LeaveIcon from '~icons/icons-16/leave'
import type { ComposerTranslation } from 'vue-i18n'
import type { Component } from 'vue'
import DeleteIcon from '~icons/icons-16/delete'

export interface HomeMoreMenuData {
  userDisplayName: string
  workspaceName?: string
  canDeleteWorkspace?: boolean
  font: string
  theme: string
  language: string
  fontIcon: Component
  themeIcon: Component
}

export function createHomeMoreMenu(
  t: ComposerTranslation,
  data: HomeMoreMenuData,
): MenuItemData[] {
  return [
    {
      id: 'profile',
      label: data.userDisplayName,
      icon: ProfileIcon,
      disabled: true,
    },
    ...(data.workspaceName
      ? [
          {
            id: 'editWorkspaceName',
            label: t('general.action.editWorkspace'),
            icon: EditIcon,
            showDivider: true,
          },
          ...(data.canDeleteWorkspace
            ? [
                {
                  id: 'deleteWorkspace',
                  label: t(
                    'general.action.deleteWorkspace',
                  ),
                  color: 'danger' as const,
                  icon: DeleteIcon,
                },
              ]
            : []),
        ]
      : []),
    {
      id: 'font',
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
    {
      id: 'logout',
      label: t('general.action.logout'),
      icon: LeaveIcon,
      showDivider: true,
      color: 'danger',
    },
  ]
}
