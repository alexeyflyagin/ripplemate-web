import type { CardItemData } from '@/components/feature/CardList'
import type { MenuItemData } from '@/components/ui/ContextMenu'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { createCardItemMenu } from '@/menu/CardItemMenu'
import { useCardStore } from '@/stores/domain/card'
import { useOverlayStore } from '@/stores/ui/overlay'
import { truncate } from '@/utils/truncate'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCardItemMenu(t: ComposerTranslation) {
  const cardStore = useCardStore()
  const overlayStore = useOverlayStore()
  let overlayId: string

  async function handleClick(
    item: MenuItemData,
    payload?: string,
  ) {
    const cardId = Number(payload)
    if (isNaN(cardId)) return

    switch (item.id) {
      case 'edit':
        overlayStore.close(overlayId)
        break
      case 'delete':
        openCardDeleteDialog(cardId)
        overlayStore.close(overlayId)
        break
    }
  }

  async function openCardDeleteDialog(cardId: number) {
    const card = await cardStore.getCard(cardId)
    const confirmOverlayId = overlayStore.open(
      ConfirmDialog,
      {
        title: t('dialog.card.delete.title'),
        caption: t('dialog.card.delete.caption', {
          term: `<strong>${truncate(card.term, 20)}</strong>`,
        }),
        confirm: t('general.action.delete'),
        cancel: t('general.action.cancel'),
        onConfirm: async () => {
          await cardStore.deleteCard(cardId)
          overlayStore.close(confirmOverlayId)
        },
        onCancel: () =>
          overlayStore.close(confirmOverlayId),
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

    overlayId = overlayStore.open(ContextMenu, {
      x: event.clientX,
      y: event.clientY,
      items: items,
      payload: cardItem.id.toString(),
      onClickItem: handleClick,
      onClose: () => overlayStore.close(overlayId),
    })
  }

  return { openCardMenu: openCardItemMenu }
}
