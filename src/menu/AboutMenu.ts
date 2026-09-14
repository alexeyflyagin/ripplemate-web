import type { MenuItemData } from '@/components/ui/ContextMenu'
import InfoCircleIcon from '~icons/icons-16/info-circle'
import TelegramIcon from '~icons/icons-16/telegram'
import type { ComposerTranslation } from 'vue-i18n'

export function createAboutMenu(
  t: ComposerTranslation,
  version: string,
): MenuItemData[] {
  return [
    {
      id: 'sendFeedback',
      label: t('general.action.sendFeedback'),
      icon: TelegramIcon,
    },
    {
      id: 'version',
      label: t('general.label.version'),
      icon: InfoCircleIcon,
      value: version,
      disabled: true,
    },
  ]
}
