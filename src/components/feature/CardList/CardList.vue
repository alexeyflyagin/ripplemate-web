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
  CardGroupLabelData,
  CardItemData,
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
import { useCardListScroll } from './useCardListScroll.ts'
import { useDateBadge } from './useDateBadge.ts'
import { nextPaint } from '@/utils/nextPaint.ts'

const props = defineProps<{
  listKey: string
  cards: CardRead[]
  hasMore: boolean
  headerHeight?: number
  newIds?: Set<string>
  leavingIds?: Set<string>
  highlitedIds?: Set<string>
}>()

const emit = defineEmits<{
  loadMore: []
  click: [
    event: MouseEvent | KeyboardEvent,
    card: CardItemData,
  ]
  contextmenu: [event: MouseEvent, card: CardItemData]
  cardSeen: [cardId: string]
  cardLeaveDone: [cardId: string]
  toggleFavorite: [cardId: string]
}>()

const dateFormatter = useDate()

const scrollEl = ref<HTMLElement>()
const wrapEl = ref<HTMLElement>()
const listRef = ref<VirtualizerHandle>()
const isPositioning = ref(false)

const headerHeight = computed(() => props.headerHeight ?? 0)

const items = computed<
  (CardItemData | CardGroupLabelData | SpacerData)[]
>(() =>
  convertCards(
    props.cards,
    dateFormatter,
    props.newIds,
    props.leavingIds,
  ),
)

const {
  distanceToBottom,
  shift,
  measure,
  scrollToBottom,
  onLoadSettled,
  maybeLoadMore,
  BOTTOM_THRESHOLD,
} = useCardListScroll({
  scrollEl,
  listRef,
  itemCount: () => items.value.length,
  hasMore: () => props.hasMore,
  onLoadMore: () => emit('loadMore'),
})

const {
  currentLabel,
  isVisible: isBadgeVisible,
  update: updateBadge,
  onActivity: onBadgeActivity,
} = useDateBadge(listRef, items, headerHeight)

function refresh() {
  measure()
  updateBadge()
}

const onScroll = useThrottleFn(() => {
  refresh()
  onBadgeActivity()
  maybeLoadMore()
}, 100)

function onScrollEnd() {
  refresh()
  maybeLoadMore()
}

let revealFallback:
  | ReturnType<typeof setTimeout>
  | undefined

watch(
  () => props.listKey,
  () => {
    isPositioning.value = true
    clearTimeout(revealFallback)
    revealFallback = setTimeout(() => {
      isPositioning.value = false
    }, 400)
  },
)

watch(items, async () => {
  if (!isPositioning.value) return

  await nextTick()
  scrollToBottom()

  await nextPaint()
  refresh()
  scrollToBottom()

  isPositioning.value = false
  clearTimeout(revealFallback)
})

let prevFirstId: string | null = null
watch(
  () => props.cards,
  async (value) => {
    const firstId = value[0]?.id ?? null
    const prependedNewer =
      value.length > 0 &&
      prevFirstId !== null &&
      firstId !== prevFirstId
    prevFirstId = firstId

    onLoadSettled()

    if (prependedNewer) {
      await nextTick()
      scrollToBottom(true)
      return
    }

    await nextTick()
    refresh()
    maybeLoadMore()
  },
)

function keepPinnedToBottom() {
  if (distanceToBottom.value < BOTTOM_THRESHOLD) {
    scrollToBottom()
  }
}

useResizeObserver(wrapEl, keepPinnedToBottom)
useResizeObserver(scrollEl, keepPinnedToBottom)

onMounted(() => {
  prevFirstId = props.cards[0]?.id ?? null
  scrollToBottom()
  refresh()
})
</script>

<template>
  <div class="card-list">
    <div
      v-if="currentLabel"
      class="card-list__date-badge"
      :class="{
        'card-list__date-badge--visible': isBadgeVisible,
      }"
    >
      {{ currentLabel }}
    </div>

    <div
      ref="scrollEl"
      class="card-scroll"
      :class="{ 'card-scroll--positioning': isPositioning }"
      @scroll="onScroll"
    >
      <div :style="{ flexGrow: 1 }" />

      <div ref="wrapEl">
        <Virtualizer
          ref="listRef"
          :data="items"
          :buffer-size="600"
          :shift="shift"
          :scroll-ref="scrollEl"
          @scroll-end="onScrollEnd"
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
            class="card-list__progress"
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
            class="card-list__row"
            :label="item.label"
          />
          <CardItem
            v-if="item.type === 'card'"
            :key="`c-${item.id}`"
            class="card-list__row card-list__card"
            :class="{
              'card-list__card--last':
                item.position === 'last',
            }"
            v-bind="item"
            :highlited="highlitedIds?.has(item.id)"
            @contextmenu="emit('contextmenu', $event, item)"
            @click="emit('click', $event, item)"
            @enter-done="emit('cardSeen', item.id)"
            @leave-done="emit('cardLeaveDone', item.id)"
            @toggle-favorite="
              emit('toggleFavorite', item.id)
            "
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

.card-list__row {
  max-width: var(--max-content-width-680);
  margin-right: auto;
  margin-left: auto;
  padding-left: var(--space-16);
  padding-right: var(--space-16);
  box-sizing: border-box;
}

.card-list__card {
  margin-bottom: var(--space-2);

  &--last {
    margin-bottom: 0;
  }
}

.card-list__progress {
  display: flex;
  justify-content: center;
  max-width: var(--max-content-width-680);
  margin-right: auto;
  margin-left: auto;
  padding: 0 var(--space-16);
  box-sizing: border-box;
}

.card-list__date-badge {
  @include elevation-1;
  @include background-blur-15;
  @include text-label;
  position: absolute;
  top: calc(
    var(--main-header-height, 0px) + var(--space-12)
  );
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  padding: var(--space-4) var(--space-12);
  border-radius: var(--corner-full);
  border: var(--stroke-subtle) solid var(--border);
  background: var(--surface-highest-80);
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.card-list__date-badge--visible {
  opacity: 1;
}

.card-scroll--positioning {
  visibility: hidden;
}

.card-scroll {
  @include fade-mask(to bottom);
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior: none;
  overflow-anchor: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
