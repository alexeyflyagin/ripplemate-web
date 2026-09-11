import { useDate } from '@/composables/useDate'
import type {
  CardGroupLabelData,
  CardItemData,
  CardPosition,
  SpacerData,
} from './CardList.types'
import type { CardRead } from '@/api/types'

export function convertCards(
  cards: CardRead[],
  dateFormatter: ReturnType<typeof useDate>,
  newIds?: Set<string>,
  leavingIds?: Set<string>,
) {
  const result: (
    | CardItemData
    | CardGroupLabelData
    | SpacerData
  )[] = []

  const ordered = [...cards].reverse()

  const groups: CardRead[][] = []
  let lastDate: string | null = null
  for (const card of ordered) {
    const dateKey = dateFormatter.toISODate(
      dateFormatter.parseBackendDate(card.created_at),
    )
    if (dateKey !== lastDate) {
      groups.push([])
      lastDate = dateKey
    }
    groups[groups.length - 1]!.push(card)
  }

  for (const group of groups) {
    const date = dateFormatter.parseBackendDate(
      group[0]!.created_at,
    )
    result.push({
      type: 'label',
      key: `h-${dateFormatter.toISODate(date)}`,
      label: dateFormatter.monthAndDay(date),
    })

    group.forEach((card, i) => {
      const position: CardPosition =
        group.length === 1
          ? 'only-one'
          : i === 0
            ? 'first'
            : i === group.length - 1
              ? 'last'
              : 'middle'

      result.push({
        type: 'card',
        id: card.id,
        term: card.term,
        timeLabel: dateFormatter.timeHHmm(
          dateFormatter.parseBackendDate(card.created_at),
        ),
        favorite: card.is_favorite,
        isNew: newIds?.has(card.id) ?? false,
        isLeaving: leavingIds?.has(card.id) ?? false,
        position,
      })
    })
  }

  result.push({ type: 'bottom-spacer' })
  result.unshift({ type: 'top-spacer' })

  return result
}
