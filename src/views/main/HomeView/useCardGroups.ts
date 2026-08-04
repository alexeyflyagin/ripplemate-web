import { useCardStore } from '@/stores/card.ts'
import { computed, ref, watch } from 'vue'
import type {
  CardGroupData,
  CardItemData,
} from '@/components/CardList/CardList.types.ts'
import { useDate } from '@/composables/useDate.ts'
import { groupByMap } from '@/utils/groupBy.ts'
import type { CardRead } from '@/api/types.ts'
import type { ComposerTranslation } from 'vue-i18n'
import { useCategoryStore } from '@/stores/category'

export function useCardGroups(t: ComposerTranslation) {
  const cardStore = useCardStore()
  const categoryStore = useCategoryStore()
  const resetScroll = ref<boolean>(true)

  const { formatMonthDay, getLocalTime } = useDate()

  watch(
    () => categoryStore.currentCategoryId,
    () => {
      resetScroll.value = true
    },
  )

  const cardGroups = computed<CardGroupData[]>(() => {
    const grouped = groupByMap<
      CardRead,
      string,
      CardItemData
    >(
      cardStore.cards,
      (item) => {
        return formatMonthDay(item.created_at, t)
      },
      (item) => {
        return {
          id: item.id,
          term: item.term,
          createdAt: getLocalTime(item.created_at),
        }
      },
    )

    return Object.entries(grouped).map<CardGroupData>(
      ([key, items]) => ({
        groupLabel: key,
        items: items,
      }),
    )
  })

  return { cardGroups, resetScroll }
}
