import type { CardItemData } from '@/components/CardList/CardList.types'
import type { MenuItemData } from '@/components/ContextMenu/ContextMenu.types'
import { createCardItemMenu } from '@/menu/CardItemMenu'
import { useCardStore } from '@/stores/card'
import { useContextMenuStore } from '@/stores/contextMenu'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCardItemMenu(t: ComposerTranslation) {
  const cardStore = useCardStore()
  const menuStore = useContextMenuStore()

  async function handleClick(
    item: MenuItemData,
    payload?: string,
  ) {
    const cardId = Number(payload)
    if (isNaN(cardId)) return

    switch (item.id) {
      case 'edit':
      // TODO
      case 'delete':
        await cardStore.deleteCard(cardId)
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

    menuStore.open({
      posX: event.clientX,
      posY: event.clientY,
      menuItems: items,
      payload: cardItem.id.toString(),
      handler: handleClick,
    })
  }

  return { openCardMenu: openCardItemMenu }
}
