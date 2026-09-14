import {
  ContextMenu,
  type MenuItemData,
} from '@/components/ui/ContextMenu'
import { createAboutMenu } from '@/menu/AboutMenu'
import { APP_VERSION } from '@/constants/version'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import type { OffsetOptions, Placement } from '@floating-ui/dom'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

const FEEDBACK_URL = 'https://t.me/alexeyflyagin'

export function useAboutMenu(t: ComposerTranslation) {
  const overlayStore = useOverlayStore()
  let overlay: OverlayHandle

  function onClickItem(item: MenuItemData) {
    switch (item.id) {
      case 'sendFeedback':
        window.open(FEEDBACK_URL, '_blank', 'noopener')
        overlay.close()
        break
    }
  }

  function openMenu(event: MouseEvent | KeyboardEvent) {
    const items = computed(() =>
      createAboutMenu(t, APP_VERSION),
    )

    const targetHtmlEl = event.currentTarget as HTMLElement

    overlay = overlayStore.open(ContextMenu, {
      targetEl: event.currentTarget,
      offsetOptions: {
        mainAxis: -targetHtmlEl.offsetHeight,
      } as OffsetOptions,
      placement: 'top-end' as Placement,
      items,
      onClickItem,
      onClose: () => overlay.close(),
    })
  }

  return { openMenu }
}
