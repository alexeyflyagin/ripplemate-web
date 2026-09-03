import type { CardItemData } from '@/components/feature/CardList'
import type { MenuItemData } from '@/components/ui/ContextMenu'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { ConfirmDialog } from '@/components/ui/Dialog/ConfirmDialog'
import { createCardItemMenu } from '@/menu/CardItemMenu'
import { useCardStore } from '@/stores/domain/card'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import {
  useOverlayStore,
  type OverlayHandle,
} from '@/stores/ui/overlay'
import { truncate } from '@/utils/truncate'
import {
  type OffsetOptions,
  type Placement,
} from '@floating-ui/dom'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useCardItemMenu(
  t: ComposerTranslation,
  options?: { editCard: (cardId: string) => void },
) {
  const cardStore = useCardStore()
  const overlayStore = useOverlayStore()
  const { currentWorkspaceId } = useCurrentWorkspace()
  let overlay: OverlayHandle

  async function handleClick(
    item: MenuItemData,
    payload?: string,
  ) {
    if (payload === undefined) return
    const cardId = payload

    switch (item.id) {
      case 'edit':
        options?.editCard(cardId)
        overlay.close()
        break
      case 'delete':
        openCardDeleteDialog(cardId)
        overlay.close()
        break
    }
  }

  async function openCardDeleteDialog(cardId: string) {
    if (!currentWorkspaceId.value) return
    const card = await cardStore.getCard(
      currentWorkspaceId.value,
      cardId,
    )
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
          await cardStore.deleteCard(
            currentWorkspaceId.value!,
            cardId,
          )
          confirmOverlay.close()
        },
        onCancel: () => confirmOverlay.close(),
      },
    )
  }

  async function openCardItemMenu(
    event: MouseEvent | KeyboardEvent,
    cardItem: CardItemData,
  ) {
    const items = computed(() => createCardItemMenu(t))

    const row = event.currentTarget as HTMLElement
    const targetEl =
      row.querySelector<HTMLElement>('.card-item') ?? row

    const targetBounding = targetEl.getBoundingClientRect()

    const offset = {
      mainAxis:
        event instanceof MouseEvent
          ? event.clientY - targetBounding.bottom
          : 2,
      crossAxis:
        event instanceof MouseEvent
          ? event.clientX - targetBounding.left
          : 0,
    } as OffsetOptions

    overlay = overlayStore.open(ContextMenu, {
      targetEl,
      items: items,
      payload: cardItem.id.toString(),
      position: 'bottom-top' as Placement,
      offsetOptions: offset,
      onClickItem: handleClick,
      onClose: () => overlay.close(),
    })
  }

  return { openCardMenu: openCardItemMenu }
}
