<script setup lang="ts">
import type {
  FollowTargetTab,
  Tab,
} from './CategoryTab.types.ts'
import { watch, onMounted, ref, onUnmounted } from 'vue'
import CategoryTab from './CategoryTab.vue'
import CaretDownIcon from '~icons/icons-12/caret-down'
import { nextPaint } from '@/utils/nextPaint.ts'

const props = defineProps<{
  tabs: Tab[]
}>()

let resizeObserver: ResizeObserver | null = null

const selectedIndex = defineModel<number>('selectedIndex', {
  default: 0,
})

const followTarget = defineModel<FollowTargetTab | null>(
  'followTarget',
  {
    default: null,
  },
)

const emit = defineEmits<{
  contextmenu: [event: MouseEvent, tab: Tab]
}>()

const containerEl = ref<HTMLElement>()
const listEl = ref<HTMLElement>()
const tabEls = ref<HTMLElement[]>([])

const listOffset = ref(0)

const indicatorWidth = ref(0)

const isReady = ref(false)

const currentTabPointerDown = ref(false)

const isDragging = ref(false)
let isPreDragging = false
let startX = 0
let startOffset = 0
let offset = 0

watch(selectedIndex, updateListOffset)
watch(followTarget, (newValue, oldValue) => {
  if (!newValue) {
    if (oldValue && oldValue.progress >= 0.5)
      selectedIndex.value = oldValue.targetIndex
    updateListOffset()
    return
  }

  const currentOffset = getOffsetForTab(selectedIndex.value)
  const targetOffset = getOffsetForTab(newValue.targetIndex)

  if (currentOffset === null || targetOffset === null)
    return

  listOffset.value =
    currentOffset +
    (targetOffset - currentOffset) * newValue.progress

  const currentWidth =
    tabEls.value[selectedIndex.value]?.offsetWidth
  const targetWidth =
    tabEls.value[newValue.targetIndex]?.offsetWidth

  if (!currentWidth || !targetWidth) return

  indicatorWidth.value =
    currentWidth +
    (targetWidth - currentWidth) * newValue.progress
})

function getOffsetForTab(index: number): number {
  const tab = tabEls.value[index]
  const container = containerEl.value
  if (!tab || !container) return 0

  const containerCenter = container.offsetWidth / 2
  const tabCenter = tab.offsetLeft + tab.offsetWidth / 2

  return containerCenter - tabCenter
}

function updateListOffset() {
  const selectedTab = tabEls.value[selectedIndex.value]
  if (!selectedTab) return

  listOffset.value = getOffsetForTab(selectedIndex.value)
  indicatorWidth.value = selectedTab.offsetWidth
}

function checkBoundaries(offset: number): number {
  const containerWidth = containerEl.value!.offsetWidth
  const firstTabWidth = tabEls.value.at(0)!.offsetWidth
  const lastTabWidth = tabEls.value.at(-1)!.offsetWidth
  const listWidth = listEl.value!.offsetWidth

  const center = containerWidth / 2
  const maxOffset = center - firstTabWidth / 2
  const minOffset = center - listWidth + lastTabWidth / 2

  if (offset > maxOffset) return maxOffset
  if (offset < minOffset) return minOffset
  return offset
}

function updateIndicatorWidth() {
  const container = containerEl.value
  if (!container || !indicatorWidth.value) return
  if (tabEls.value.length === 0) return
  if (tabEls.value.length === 1) {
    indicatorWidth.value = tabEls.value[0]!.offsetWidth
  }

  const containerCenter = container.offsetWidth / 2

  type TabInfo = {
    el: HTMLElement
    distance: number
    center: number
  }

  const leftTab = tabEls.value.reduce<TabInfo | null>(
    (acc, tab) => {
      const center =
        tab.offsetLeft +
        tab.offsetWidth / 2 +
        listOffset.value
      if (center > containerCenter) return acc
      if (!acc || center > acc.center) {
        return {
          el: tab,
          distance: Math.abs(center - containerCenter),
          center,
        }
      }
      return acc
    },
    null,
  )

  const rightTab = tabEls.value.reduce<TabInfo | null>(
    (acc, tab) => {
      const center =
        tab.offsetLeft +
        tab.offsetWidth / 2 +
        listOffset.value
      if (center <= containerCenter) return acc
      if (!acc || center < acc.center) {
        return {
          el: tab,
          distance: Math.abs(center - containerCenter),
          center,
        }
      }
      return acc
    },
    null,
  )

  if (!leftTab || !rightTab) return

  const lDistance = leftTab.distance
  const rDistance = rightTab.distance

  const totalDistance = lDistance + rDistance
  const progress =
    totalDistance === 0 ? 0 : lDistance / totalDistance

  indicatorWidth.value =
    leftTab.el.offsetWidth +
    (rightTab.el.offsetWidth - leftTab.el.offsetWidth) *
      progress
}

function getClosestTabIndex(): number {
  const container = containerEl.value
  if (!container) return selectedIndex.value

  const containerCenter = container.offsetWidth / 2

  let closestIndex = 0
  let closestDistance = Infinity

  tabEls.value.forEach((tab, index) => {
    const tabCenter =
      tab.offsetLeft +
      tab.offsetWidth / 2 +
      listOffset.value
    const distance = Math.abs(tabCenter - containerCenter)

    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  return closestIndex
}

function onPointerDown(event: PointerEvent) {
  if (followTarget.value) return
  isPreDragging = true
  startX = event.clientX
  startOffset = listOffset.value
  offset = 0
  ;(event.target as HTMLElement).setPointerCapture(
    event.pointerId,
  )
}

function onPointerMove(event: PointerEvent) {
  if (!isPreDragging) return
  offset = event.clientX - startX
  if (!isDragging.value && Math.abs(offset) > 5)
    isDragging.value = true
  listOffset.value = checkBoundaries(startOffset + offset)
  updateIndicatorWidth()
}

function onPointerUp() {
  isPreDragging = false
  if (!isDragging.value) return
  isDragging.value = false

  const closestIndex = getClosestTabIndex()
  selectedIndex.value = closestIndex
  updateListOffset()
}

function onTabClick(event: MouseEvent, index: number) {
  updateListOffset()
  if (followTarget.value) return
  if (Math.abs(offset) > 5) return
  if (
    selectedIndex.value === index &&
    props.tabs[index]?.clickable
  ) {
    emit('contextmenu', event, props.tabs[index])
    currentTabPointerDown.value = false
  }
  selectedIndex.value = index
}

function onTabPointerDown(
  event: MouseEvent,
  index: number,
) {
  if (
    selectedIndex.value !== index ||
    !props.tabs[index]?.clickable
  )
    return

  currentTabPointerDown.value = true
}

function onTabPointerUp() {
  if (currentTabPointerDown.value === false) return

  currentTabPointerDown.value = false
}

onMounted(async () => {
  await document.fonts.ready
  await nextPaint()

  resizeObserver = new ResizeObserver(async () => {
    isReady.value = false
    updateListOffset()
    await nextPaint()
    isReady.value = true
  })

  if (containerEl.value) {
    resizeObserver.observe(containerEl.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="tabs"
    ref="containerEl"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div
      class="tabs__list"
      ref="listEl"
      :class="{
        'tabs__list--is-following': followTarget,
        'tabs__list--dragging': isDragging,
        'tabs__list--is-ready': isReady,
      }"
      :style="{ transform: `translateX(${listOffset}px)` }"
    >
      <CategoryTab
        v-for="(tab, index) in tabs"
        :key="tab.value"
        :label="tab.label"
        :ref="(el: any) => (tabEls[index] = el?.$el)"
        :active="index === selectedIndex"
        @click="onTabClick($event, index)"
        @pointerdown="onTabPointerDown($event, index)"
        @pointerup="onTabPointerUp"
      />
    </div>

    <div
      class="tabs__active-indicator"
      :class="{
        'tabs__active-indicator--is-following':
          followTarget,
        'tabs__active-indicator--dragging':
          isDragging || followTarget,
        'tabs__active-indicator--is-ready': isReady,
      }"
      :style="{ width: indicatorWidth + 'px' }"
    />

    <CaretDownIcon
      class="tabs__drop-down-icon"
      :class="{
        'tabs__drop-down-icon--pressed':
          currentTabPointerDown,
        'tabs__drop-down-icon--is-hidden':
          !props.tabs[selectedIndex]?.clickable,
        'tabs__drop-down-icon--is-dragging':
          isDragging || followTarget,
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  position: relative;
  display: flex;
  overflow: hidden;
  background-color: transparent;
  touch-action: none;
  cursor: grab;
  padding: var(--space-4) 0;
  user-select: none;

  mask-image: linear-gradient(
    to right,
    transparent 0,
    black 60px,
    black calc(100% - 60px),
    transparent 100%
  );

  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    black 60px,
    black calc(100% - 60px),
    transparent 100%
  );
}

.tabs__list {
  display: inline-flex;
  flex-shrink: 0;
  opacity: 0;
}

.tabs__active-indicator {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  top: 50%;
  width: 100px;
  height: 40px;
  border-radius: var(--corner-large);
  background-color: var(--accent);
  pointer-events: none;
  transition: height 0.3s ease;
  opacity: 0;
}

.tabs__active-indicator--is-ready {
  opacity: var(--opacity-20);
  transition:
    width 0.3s ease,
    height 0.3s ease;
}

.tabs__list--is-ready {
  opacity: 1;
  transition: transform 0.3s ease;
}

.tabs__active-indicator--dragging {
  transition: height 0.3s ease;
  height: 44px;
}

.tabs__list--dragging,
.tabs__list--is-following,
.tabs__active-indicator--is-following {
  transition: none;
}

.tabs__drop-down-icon {
  position: absolute;
  width: 12px;
  height: 12px;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  bottom: 6px;
  color: var(--accent);
  opacity: var(--opacity-40);
  pointer-events: none;
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}

.tabs__drop-down-icon--pressed {
  transform: translateX(-50%) translateY(2px);
}

.tabs__drop-down-icon--is-hidden,
.tabs__drop-down-icon--is-dragging {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform: translateX(-50%) translateY(4px);
  opacity: 0;
}
</style>
