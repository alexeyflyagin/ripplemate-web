import type { MenuItemData } from '@/components/ui/ContextMenu'
import type { ComposerTranslation } from 'vue-i18n'
import EditIcon from '~icons/icons-16/edit'
import DeleteIcon from '~icons/icons-16/delete'

export interface CardItemMenuData {
  cardTerm: string
}

export function createCardItemMenu(
  t: ComposerTranslation,
  data: CardItemMenuData,
): MenuItemData[] {
  return [
    {
      id: 'change',
      label: t('general.action.edit'),
      icon: EditIcon,
      value: data.cardTerm,
    },
    {
      id: 'delete',
      label: t('general.action.delete'),
      icon: DeleteIcon,
      color: 'danger',
    },
  ]
}
