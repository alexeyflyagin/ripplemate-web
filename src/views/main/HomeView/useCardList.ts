import { useCardStore } from '@/stores/card.ts'
import { computed } from 'vue'
import type {
  CardGroupLabelData,
  CardItemData,
} from '@/components/CardList/CardList.types.ts'
import { useDate } from '@/composables/useDate'

export function useCardGroups() {
  const cardStore = useCardStore()
  const {
    parseBackendDate,
    toISODate,
    monthAndDay,
    timeHHmm,
  } = useDate()

  const items = computed<
    (CardItemData | CardGroupLabelData)[]
  >(() => {
    const result: (CardItemData | CardGroupLabelData)[] = []
    let lastDate: string | null = null

    const ordered = [...cardStore.cards].reverse()

    for (const card of ordered) {
      const date = parseBackendDate(card.created_at)
      const dateKey = toISODate(date)

      if (dateKey !== lastDate) {
        result.push({
          type: 'label',
          key: `h-${dateKey}`,
          label: monthAndDay(date),
        })
        lastDate = dateKey
      }

      result.push({
        type: 'card',
        id: card.id,
        term: card.term,
        timeLabel: timeHHmm(date),
        isFavorite: false,
      })
    }

    return result
  })

  return { items }
}
