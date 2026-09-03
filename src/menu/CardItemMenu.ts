import type { MenuItemData } from '@/components/ui/ContextMenu'
import type { ComposerTranslation } from 'vue-i18n'
import EditIcon from '~icons/icons-16/edit'
import DeleteIcon from '~icons/icons-16/delete'

export interface CardItemMenuData {
  cardTerm: string
}

export function createCardItemMenu(
  t: ComposerTranslation,
): MenuItemData[] {
  return [
    {
      id: 'edit',
      label: t('general.action.edit'),
      icon: EditIcon,
    },
    {
      id: 'delete',
      label: t('general.action.delete'),
      icon: DeleteIcon,
      color: 'danger',
    },
  ]
}
