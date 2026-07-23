import type { ComposerTranslation } from 'vue-i18n'
import type { Tab } from '@/components/Tabs/CategoryTabs/CategoryTab.types'

export function createAllTab(t: ComposerTranslation): Tab {
  return {
    value: -1,
    label: t('general.label.all'),
  }
}
