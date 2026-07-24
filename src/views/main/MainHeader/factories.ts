import type { ComposerTranslation } from 'vue-i18n'
import type { Tab } from '@/components/Tabs/CategoryTabs/CategoryTab.types'
import type { MenuItemData } from '@/components/ContextMenu/ContextMenu.types'
import PlusIcon from '~icons/icons-16/plus'

export function createAllTab(t: ComposerTranslation): Tab {
  return {
    value: -1,
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
