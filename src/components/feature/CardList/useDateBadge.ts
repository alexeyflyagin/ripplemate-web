import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { VirtualizerHandle } from 'virtua/vue'
import type {
  CardGroupLabelData,
  CardItemData,
  SpacerData,
} from './CardList.types'

type ListItem = CardItemData | CardGroupLabelData | SpacerData

const IDLE_HIDE_DELAY = 5000

export function useDateBadge(
  listRef: Ref<VirtualizerHandle | undefined>,
  items: ComputedRef<ListItem[]>,
  headerHeight: Ref<number>,
) {
  const topVisibleIndex = ref(0)
  const isScrolling = ref(false)
  const isAtTop = ref(true)
  const isCurrentLabelVisible = ref(true)

  let idleTimer: ReturnType<typeof setTimeout> | undefined

  const currentLabel = computed<string | null>(() => {
    for (let i = topVisibleIndex.value; i >= 0; i--) {
      const item = items.value[i]
      if (item?.type === 'label') return item.label
    }
    for (const item of items.value) {
      if (item.type === 'label') return item.label
    }
    return null
  })

  const isVisible = computed(
    () =>
      currentLabel.value !== null &&
      isScrolling.value &&
      !isAtTop.value &&
      !isCurrentLabelVisible.value,
  )

  function findLabelIndexAbove(index: number): number {
    for (let i = index; i >= 0; i--) {
      if (items.value[i]?.type === 'label') return i
    }
    return -1
  }

  function update() {
    const list = listRef.value
    if (!list) return

    const scroll = list.scrollOffset ?? 0
    const visibleTop = scroll + headerHeight.value

    isAtTop.value = scroll <= 1

    const index = list.findItemIndex(visibleTop)
    if (index !== undefined) topVisibleIndex.value = index

    const labelIndex = findLabelIndexAbove(topVisibleIndex.value)
    if (labelIndex === -1) {
      isCurrentLabelVisible.value = true
      return
    }

    const labelBottom =
      list.getItemOffset(labelIndex) +
      list.getItemSize(labelIndex)
    isCurrentLabelVisible.value = labelBottom > visibleTop
  }

  function onActivity() {
    isScrolling.value = true
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      isScrolling.value = false
    }, IDLE_HIDE_DELAY)
  }

  return { currentLabel, isVisible, update, onActivity }
}
