import type { MenuItemData } from '@/components/ui/ContextMenu'
import EditIcon from '~icons/icons-16/edit'
import DeleteIcon from '~icons/icons-16/delete'
import type { ComposerTranslation } from 'vue-i18n'

export interface WorkspaceMoreMenuData {
  canDeleteWorkspace: boolean
}

export function createWorkspaceMoreMenu(
  t: ComposerTranslation,
  data: WorkspaceMoreMenuData,
): MenuItemData[] {
  return [
    {
      id: 'editWorkspaceName',
      label: t('general.action.editWorkspace'),
      icon: EditIcon,
    },
    ...(data.canDeleteWorkspace
      ? [
          {
            id: 'deleteWorkspace',
            label: t('general.action.deleteWorkspace'),
            icon: DeleteIcon,
            color: 'danger' as const,
          },
        ]
      : []),
  ]
}
