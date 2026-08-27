<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import type { CardRead } from '@/api/types'
import type {
  CardItemData,
  CardGroupLabelData,
  SpacerData,
} from './CardList.types'
import CardItem from './CardItem.vue'
import CardGroupLabel from './CardGroupLabel.vue'
import { convertCards } from './CardList.utils.ts'
import { useDate } from '@/composables/useDate.ts'
import {
  Virtualizer,
  type VirtualizerHandle,
} from 'virtua/vue'
import { CircularProgressBar } from '@/components/ui/ProgressBar/CircularProgressBar'
import {
  useResizeObserver,
  useThrottleFn,
} from '@vueuse/core'

const SMOOTH_SCROLL_MAX_DISTANCE = 2000
const TOP_THRESHOLD = 600
const BOTTOM_THRESHOLD = 100
const SMALL_BOTTOM_THRESHOLD = 10
let initialized = false

const dateFormatter = useDate()

const props = defineProps<{
  listKey: string
  cards: CardRead[]
  hasMore: boolean
  headerHeight?: number
}>()

const emit = defineEmits<{
  loadMore: []
  click: [
    event: MouseEvent | KeyboardEvent,
    card: CardItemData,
  ]
  contextmenu: [event: MouseEvent, card: CardItemData]
  scroll: [event: Event, isNearBottom: boolean]
}>()

const scrollEl = ref<HTMLElement>()
const wrapEl = ref<HTMLElement>()
const listRef = ref<VirtualizerHandle>()
const shift = ref<boolean>(false)
const distanceToTop = ref<number>(0)
const distanceToBottom = ref<number>(0)

const isNearBottom = computed<boolean>(
  () => distanceToBottom.value <= BOTTOM_THRESHOLD,
)

const items = computed<
  (CardItemData | CardGroupLabelData | SpacerData)[]
>(() => convertCards(props.cards, dateFormatter))

const topVisibleIndex = ref<number>(0)

const currentDateLabel = computed<string | null>(() => {
  for (let i = topVisibleIndex.value; i >= 0; i--) {
    const item = items.value[i]
    if (item?.type === 'label') return item.label
  }
  for (const item of items.value) {
    if (item.type === 'label') return item.label
  }
  return null
})

function updateTopVisibleIndex() {
  const offset = listRef.value?.scrollOffset
  if (offset === undefined) return
  const index = listRef.value?.findItemIndex(
    offset + (props.headerHeight ?? 0),
  )
  if (index !== undefined) topVisibleIndex.value = index
}

watch(
  () => props.headerHeight,
  () => {
    updateTopVisibleIndex()
    updateBadgeState()
  },
)

const isScrolling = ref<boolean>(false)
const isAtTop = ref<boolean>(true)
const isCurrentLabelVisible = ref<boolean>(true)
let scrollIdleTimer:
  | ReturnType<typeof setTimeout>
  | undefined

const isBadgeVisible = computed<boolean>(
  () =>
    currentDateLabel.value !== null &&
    isScrolling.value &&
    !isAtTop.value &&
    !isCurrentLabelVisible.value,
)

function markScrolling() {
  isScrolling.value = true
  clearTimeout(scrollIdleTimer)
  scrollIdleTimer = setTimeout(() => {
    isScrolling.value = false
  }, 5000)
}

function updateBadgeState() {
  const list = listRef.value
  if (!list) return

  const scroll = list.scrollOffset ?? 0
  const visibleTop = scroll + (props.headerHeight ?? 0)

  isAtTop.value = scroll <= 1

  let labelIndex = -1
  for (let i = topVisibleIndex.value; i >= 0; i--) {
    if (items.value[i]?.type === 'label') {
      labelIndex = i
      break
    }
  }

  if (labelIndex === -1) {
    isCurrentLabelVisible.value = true
    return
  }

  const labelBottom =
    list.getItemOffset(labelIndex) +
    list.getItemSize(labelIndex)
  isCurrentLabelVisible.value = labelBottom > visibleTop
}

function getDistanceToBottom(): number {
  const el = scrollEl.value
  if (!el) return 0
  return el.scrollHeight - el.scrollTop - el.offsetHeight
}

const onScroll = useThrottleFn((event: Event) => {
  distanceToBottom.value = getDistanceToBottom()
  distanceToTop.value = scrollEl.value?.scrollTop ?? 0
  updateTopVisibleIndex()
  updateBadgeState()
  markScrolling()
  emit('scroll', event, isNearBottom.value)
}, 100)

function scrollToBottom(options?: { smooth: boolean }) {
  if (
    options?.smooth &&
    distanceToBottom.value > SMOOTH_SCROLL_MAX_DISTANCE
  ) {
    const offset =
      distanceToBottom.value - SMOOTH_SCROLL_MAX_DISTANCE
    listRef.value?.scrollBy(offset)
  }

  listRef.value?.scrollToIndex(items.value.length - 1, {
    align: 'end',
    smooth: options?.smooth,
  })
}

async function loadMore() {
  if (shift.value) return

  shift.value = true
  const timer = setTimeout(() => {
    stop()
    shift.value = false
  }, 5000)

  const stop = watch(items, async () => {
    await nextTick()
    shift.value = false
    clearTimeout(timer)
    stop()
  })

  emit('loadMore')
}

watch(
  () => props.listKey,
  () => {
    initialized = false
    const stop = watch(items, () => {
      scrollToBottom()
      stop()
    })
  },
)

watch(
  () => [...props.cards],
  async (value, oldValue) => {
    if (!initialized) {
      initialized = true
      return
    }

    if (
      value.length > oldValue.length &&
      oldValue[0] !== value[0]
    ) {
      await nextTick()
      scrollToBottom({ smooth: true })
    }
  },
  { deep: true },
)

async function maybeLoadMore() {
  if (
    distanceToTop.value < TOP_THRESHOLD &&
    props.hasMore &&
    !shift.value
  ) {
    await loadMore()
  }
}

watch(distanceToTop, maybeLoadMore)

function onScrollEnd() {
  distanceToTop.value = scrollEl.value?.scrollTop ?? 0
  updateBadgeState()
  maybeLoadMore()
}

useResizeObserver(wrapEl, () => {
  if (distanceToBottom.value < SMALL_BOTTOM_THRESHOLD)
    scrollToBottom()
})
useResizeObserver(scrollEl, () => {
  if (distanceToBottom.value < BOTTOM_THRESHOLD)
    scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
  updateTopVisibleIndex()
})
</script>

<template>
  <div class="card-list">
    <div
      v-if="currentDateLabel"
      class="card-list__date-badge"
      :class="{
        'card-list__date-badge--visible': isBadgeVisible,
      }"
    >
      {{ currentDateLabel }}
    </div>

    <div
      ref="scrollEl"
      class="card-scroll"
      @scroll="onScroll"
    >
      <div :style="{ flexGrow: 1 }" />

      <div ref="wrapEl">
        <Virtualizer
          ref="listRef"
          @scroll-end="onScrollEnd"
          :data="items"
          :buffer-size="600"
          :shift="shift"
          :scroll-ref="scrollEl"
          #default="{ item }"
        >
          <div
            v-if="item.type === 'top-spacer'"
            :key="'top-spacer'"
            :style="{
              height: 'var(--top-spacer, var(--space-24))',
            }"
          />
          <CircularProgressBar
            v-if="item.type === 'top-spacer' && hasMore"
            :key="'progress-bar'"
            :style="{
              display: 'flex',
              'justify-content': 'center',
              maxWidth: 'var(--max-content-width-680)',
              marginRight: 'auto',
              marginLeft: 'auto',
              padding: '0 var(--space-16)',
              boxSizing: 'border-box',
            }"
          />
          <div
            v-if="item.type === 'bottom-spacer'"
            :key="'bottom-spacer'"
            :style="{
              height:
                'var(--bottom-spacer, var(--space-24))',
            }"
          />
          <CardGroupLabel
            v-if="item.type === 'label'"
            :key="item.key"
            :label="item.label"
            :style="{
              maxWidth: 'var(--max-content-width-680)',
              marginRight: 'auto',
              marginLeft: 'auto',
              paddingLeft: 'var(--space-16)',
              paddingRight: 'var(--space-16)',
              boxSizing: 'border-box',
            }"
          />
          <CardItem
            v-if="item.type === 'card'"
            :key="`c-${item.id}`"
            v-bind="item"
            :style="{
              maxWidth: 'var(--max-content-width-680)',
              marginBottom:
                item.position === 'last'
                  ? '0'
                  : 'var(--space-2)',
              marginRight: 'auto',
              marginLeft: 'auto',
              paddingLeft: 'var(--space-16)',
              paddingRight: 'var(--space-16)',
              boxSizing: 'border-box',
            }"
            @contextmenu="emit('contextmenu', $event, item)"
            @click="emit('click', $event, item)"
          />
        </Virtualizer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/blur' as *;

.card-list {
  position: relative;
  height: 100%;
  min-height: 0;
}

.card-list__date-badge {
  @include elevation-2;
  @include background-blur-15;
  @include text-label;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  top: calc(
    var(--main-header-height, 0px) + var(--space-12)
  );
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  padding: var(--space-4) var(--space-12);
  border-radius: var(--corner-full);
  border: var(--stroke-subtle) solid var(--border-muted);
  background: var(--surface-80);
  color: var(--text-muted);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.card-list__date-badge--visible {
  opacity: 1;
}

.card-scroll {
  @include fade-mask(to bottom);
  display: flex;
  height: 100%;
  overscroll-behavior: none;
  flex-direction: column;
  overflow-y: auto;
  overflow-anchor: none;
  scrollbar-width: none;
  min-height: 0;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
