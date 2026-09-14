import type { MenuItemData } from '@/components/ui/ContextMenu'
import FolderIcon from '~icons/icons-16/folder'
import EditIcon from '~icons/icons-16/edit'
import DeleteIcon from '~icons/icons-16/delete'
import RefreshIcon from '~icons/icons-16/refresh'
import type { ComposerTranslation } from 'vue-i18n'

export interface MainMoreMenuData {
  categoryName: string
  canManageCategory: boolean
}

export function createMainMoreMenu(
  t: ComposerTranslation,
  data: MainMoreMenuData,
): MenuItemData[] {
  return [
    {
      id: 'refresh',
      label: t('general.action.refresh'),
      icon: RefreshIcon,
    },
    {
      id: 'name',
      label: data.categoryName,
      icon: FolderIcon,
      disabled: true,
      showDivider: true,
    },
    ...(data.canManageCategory
      ? [
          {
            id: 'edit',
            label: t('general.action.edit'),
            icon: EditIcon,
          },
          {
            id: 'delete',
            label: t('general.action.delete'),
            icon: DeleteIcon,
            color: 'danger' as const,
          },
        ]
      : []),
  ]
}
