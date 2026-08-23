import type { CardItemData } from '@/components/feature/CardList'
import type { MenuItemData } from '@/components/ui/ContextMenu'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { createCardItemMenu } from '@/menu/CardItemMenu'
import { useCardStore } from '@/stores/domain/card'
import { useOverlayStore } from '@/stores/ui/overlay'
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
        await cardStore.deleteCard(cardId)
        overlayStore.close(overlayId)
        break
    }
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
