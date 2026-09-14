import type { MenuItemData } from '@/components/ui/ContextMenu'
import type { ComposerTranslation } from 'vue-i18n'
import PlusIcon from '~icons/icons-16/plus'
import type { CategoryItemData } from './CategoryItem.types'

export const ALL_CATEGORY_ID = 'all'

export function createAddWorkspaceMenuItem(
  t: ComposerTranslation,
  showDivider: boolean,
): MenuItemData {
  return {
    id: 'add',
    label: t('general.action.addWorkspace'),
    icon: PlusIcon,
    showDivider: showDivider,
  }
}

export function createAllCategoryItemData(
  t: ComposerTranslation,
): CategoryItemData {
  return {
    id: ALL_CATEGORY_ID,
    label: t('general.label.all'),
  }
}
