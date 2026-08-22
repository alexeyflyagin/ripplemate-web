import type { MenuItemData } from '@/components/ui/ContextMenu'
import FolderIcon from '~icons/icons-16/folder'
import EditIcon from '~icons/icons-16/edit'
import DeleteIcon from '~icons/icons-16/delete'
import type { ComposerTranslation } from 'vue-i18n'

export function createCategoryMenu(
  t: ComposerTranslation,
  categoryName: string,
): MenuItemData[] {
  return [
    {
      id: 'name',
      label: categoryName,
      icon: FolderIcon,
      disabled: true,
    },
    {
      id: 'edit',
      label: t('general.action.edit'),
      icon: EditIcon,
      showDivider: true,
    },
    {
      id: 'delete',
      label: t('general.action.delete'),
      icon: DeleteIcon,
      color: 'danger',
    },
  ]
}
