import type { CardItemData } from '@/components/feature/CardList'
import type { MenuItemData } from '@/components/ui/ContextMenu'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { createCardItemMenu } from '@/menu/CardItemMenu'
import { useCardStore } from '@/stores/domain/card'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import { truncate } from '@/utils/truncate'
import type { Placement } from '@floating-ui/dom'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCardItemMenu(t: ComposerTranslation) {
  const cardStore = useCardStore()
  const overlayStore = useOverlayStore()
  let overlay: OverlayHandle

  async function handleClick(
    item: MenuItemData,
    payload?: string,
  ) {
    const cardId = Number(payload)
    if (isNaN(cardId)) return

    switch (item.id) {
      case 'edit':
        overlay.close()
        break
      case 'delete':
        openCardDeleteDialog(cardId)
        overlay.close()
        break
    }
  }

  async function openCardDeleteDialog(cardId: number) {
    const card = await cardStore.getCard(cardId)
    const confirmOverlay = overlayStore.open(
      ConfirmDialog,
      {
        title: t('dialog.card.delete.title'),
        caption: t('dialog.card.delete.caption', {
          term: `<strong>${truncate(card.term, 20)}</strong>`,
        }),
        type: 'destructive',
        confirm: t('general.action.delete'),
        onConfirm: async () => {
          await cardStore.deleteCard(cardId)
          confirmOverlay.close()
        },
        onCancel: () => confirmOverlay.close(),
      },
    )
  }

  async function openCardItemMenu(
    event: MouseEvent,
    cardItem: CardItemData,
  ) {
    const items = computed(() =>
      createCardItemMenu(t, { cardTerm: cardItem.term }),
    )

    overlay = overlayStore.open(ContextMenu, {
      targetEl: event.currentTarget,
      items: items,
      payload: cardItem.id.toString(),
      placement: 'bottom' as Placement,
      onClickItem: handleClick,
      onClose: () => overlay.close(),
    })
  }

  return { openCardMenu: openCardItemMenu }
}
