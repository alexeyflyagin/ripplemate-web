import { ref, type Ref } from 'vue'
import type { VirtualizerHandle } from 'virtua/vue'

const TOP_THRESHOLD = 600
const BOTTOM_THRESHOLD = 100
const SMOOTH_SCROLL_MAX_DISTANCE = 2000
const LOAD_GUARD_TIMEOUT = 5000

export function useCardListScroll(options: {
  scrollEl: Ref<HTMLElement | undefined>
  listRef: Ref<VirtualizerHandle | undefined>
  itemCount: () => number
  hasMore: () => boolean
  onLoadMore: () => void
}) {
  const { scrollEl, listRef, itemCount, hasMore, onLoadMore } =
    options

  const distanceToTop = ref(0)
  const distanceToBottom = ref(0)
  const shift = ref(false)

  let loadGuardTimer:
    | ReturnType<typeof setTimeout>
    | undefined

  function measure() {
    const el = scrollEl.value
    if (!el) return
    distanceToTop.value = el.scrollTop
    distanceToBottom.value =
      el.scrollHeight - el.scrollTop - el.offsetHeight
  }

  function scrollToBottom(smooth = false) {
    const count = itemCount()
    if (count === 0) return

    if (
      smooth &&
      distanceToBottom.value > SMOOTH_SCROLL_MAX_DISTANCE
    ) {
      listRef.value?.scrollBy(
        distanceToBottom.value - SMOOTH_SCROLL_MAX_DISTANCE,
      )
    }

    listRef.value?.scrollToIndex(count - 1, {
      align: 'end',
      smooth,
    })
  }

  function loadMore() {
    if (shift.value) return

    shift.value = true
    loadGuardTimer = setTimeout(() => {
      shift.value = false
    }, LOAD_GUARD_TIMEOUT)

    onLoadMore()
  }

  function onLoadSettled() {
    if (!shift.value) return
    shift.value = false
    clearTimeout(loadGuardTimer)
  }

  function maybeLoadMore() {
    if (
      distanceToTop.value < TOP_THRESHOLD &&
      hasMore() &&
      !shift.value
    ) {
      loadMore()
    }
  }

  return {
    distanceToTop,
    distanceToBottom,
    shift,
    measure,
    scrollToBottom,
    onLoadSettled,
    maybeLoadMore,
    BOTTOM_THRESHOLD,
  }
}
