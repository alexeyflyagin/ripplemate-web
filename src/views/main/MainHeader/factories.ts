import type { ComposerTranslation } from 'vue-i18n'
import type { MenuItemData } from '@/components/ui/ContextMenu'
import PlusIcon from '~icons/icons-16/plus'
import type { TabItemData } from '@/components/ui/Tabs'

export function createAllTab(
  t: ComposerTranslation,
): TabItemData {
  return {
    id: 'all',
    label: t('general.label.all'),
  }
}

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
