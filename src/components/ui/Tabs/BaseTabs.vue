<script setup lang="ts">
import {
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type Component,
} from 'vue'
import TabIconButton from './TabIconButton.vue'
import type { TabItemData } from './BaseTabs.types.ts'
import TabItem from './TabItem.vue'
import { useLoop } from '@/utils/useLoop.ts'

const AUTO_SCROLL_TIMER = 60000

let autoScrollTimerId: number | undefined = undefined
const { startLoop } = useLoop()
let resizeObserver: ResizeObserver | null = null
let rafId: number | null = null
const maxFade = 40
const isReady = ref<boolean>(false)
const isAnimated = ref<boolean>(true)
const fadeStart = ref<number>(0)
const fadeEnd = ref<number>(0)
const tabListEl = ref<HTMLElement>()
const tabEls = ref<Map<string, HTMLElement>>(new Map())
const indicatorWidth = ref<number>(0)
const indicatorOffset = ref<number>(0)

const activeId = defineModel<string>('activeId', {
  required: true,
})

const props = defineProps<{
  tabs: TabItemData[]
  isReadyProp?: boolean
  firstButtonIcon?: Component
  lastButtonIcon?: Component
  selectedTabId?: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent, id: string]
  contextmenu: [event: MouseEvent, id: string]
  fistButtonClick: [event: MouseEvent, activeId: string]
  lastButtonClick: [event: MouseEvent, activeId: string]
}>()

watch(activeId, (id) => {
  updateIndicator()
  if (isNeedScroll(id)) scrollToTab(id)
})

watch(
  () => props.selectedTabId,
  (value) => {
    if (value) {
      clearAutoScrollTimeout()
      return
    }
    setAutoScrollTimeout()
  },
)

watch(
  tabEls,
  async () => {
    updateIndicator()
    scrollToTab(activeId.value, !isReady.value)
    await nextTick()
    if (isReady.value !== props.isReadyProp)
      isReady.value = props.isReadyProp
  },
  { deep: true },
)

function clearAutoScrollTimeout() {
  clearTimeout(autoScrollTimerId)
  autoScrollTimerId = undefined
}

function setAutoScrollTimeout() {
  clearTimeout(autoScrollTimerId)
  autoScrollTimerId = setTimeout(() => {
    scrollToTab(activeId.value)
  }, AUTO_SCROLL_TIMER)
}

function setTabRef(
  id: string,
  el: HTMLElement | undefined,
) {
  const previousEl = tabEls.value.get(id)
  if (previousEl) resizeObserver?.unobserve(previousEl)

  if (el) {
    tabEls.value.set(id, el)
    resizeObserver?.observe(el)
  } else {
    tabEls.value.delete(id)
  }
}

function onTabClick(event: MouseEvent, id: string) {
  emit('click', event, id)
  activeId.value = id
}

function onScroll() {
  setAutoScrollTimeout()
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    updateFade()
    rafId = null
  })
}

function updateFade() {
  if (!tabListEl.value) return

  const scrollLeft = tabListEl.value.scrollLeft
  const scrollRight =
    tabListEl.value.scrollWidth -
    tabListEl.value.offsetWidth -
    scrollLeft
  fadeStart.value = Math.min(maxFade, scrollLeft * 2)
  fadeEnd.value = Math.min(maxFade, scrollRight * 2)
}

function onWheel(event: WheelEvent) {
  setAutoScrollTimeout()
  if (!tabListEl.value) return
  event.preventDefault()
  const delta =
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY
  tabListEl.value.scrollLeft += delta
}

function isNeedScroll(id: string) {
  const tabEl = tabEls.value.get(id)
  if (!tabListEl.value || !tabEl) return

  const containerLeft = tabListEl.value.scrollLeft
  const containerRight =
    containerLeft + tabListEl.value.offsetWidth
  const indicatorLeft = tabEl.offsetLeft
  const indicatorRight =
    tabEl.offsetLeft + tabEl.offsetWidth

  if (
    indicatorLeft < containerLeft ||
    indicatorRight > containerRight
  )
    return true

  return false
}

function scrollToTab(id: string, instant?: boolean) {
  const tabEl = tabEls.value.get(id)
  if (!tabEl) return

  tabEl.scrollIntoView({
    behavior: instant ? 'instant' : 'smooth',
    inline: 'center',
    block: 'center',
  })

  clearAutoScrollTimeout()
}

function updateIndicator() {
  const tabEl = tabEls.value.get(activeId.value)
  if (!tabEl) return

  indicatorOffset.value = tabEl.offsetLeft
  indicatorWidth.value = tabEl.offsetWidth
}

onMounted(async () => {
  await document.fonts.ready

  resizeObserver = new ResizeObserver(async () => {
    updateIndicator()
    if (!props.selectedTabId && !autoScrollTimerId)
      scrollToTab(activeId.value)
    startLoop(updateFade, 350, true)
  })

  if (tabListEl.value) {
    resizeObserver.observe(tabListEl.value)
  }

  tabListEl.value?.addEventListener('wheel', onWheel, {
    passive: false,
  })
})

onUnmounted(() => {
  tabListEl.value?.removeEventListener('wheel', onWheel)
})
</script>

<template>
  <div class="base-tabs">
    <div
      class="content"
      :class="{ 'content--is-not-ready': !isReady }"
    >
      <TabIconButton
        v-if="firstButtonIcon"
        :icon="firstButtonIcon"
        @click="emit('fistButtonClick', $event, activeId)"
      />
      <div
        class="tab-list"
        ref="tabListEl"
        :style="{
          '--fade-start': fadeStart + 'px',
          '--fade-end': fadeEnd + 'px',
        }"
        @scroll="onScroll"
      >
        <TransitionGroup
          tag="div"
          :name="isReady && isAnimated ? 'tab-item' : ''"
          class="tab-list__items"
        >
          <TabItem
            v-for="item in tabs"
            :ref="(el: any) => setTabRef(item.id, el?.$el)"
            :key="item.id"
            v-bind="item"
            :active="item.id === activeId"
            :selected="item.id === props.selectedTabId"
            :style="{ 'z-index': 1 }"
            @click="onTabClick($event, item.id)"
            @contextmenu="
              emit('contextmenu', $event, item.id)
            "
          />
        </TransitionGroup>
        <div
          class="tab-list__indicator"
          :class="{
            'tab-list__indicator--is-not-ready': !isReady,
          }"
          :style="{
            width: `${indicatorWidth}px`,
            transform: `translateX(${indicatorOffset}px) translateY(-50%)`,
          }"
        />
      </div>
      <TabIconButton
        v-if="lastButtonIcon"
        :icon="lastButtonIcon"
        @click="emit('lastButtonClick', $event, activeId)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/blur' as *;

.base-tabs {
  @include background-blur-20;
  position: relative;
  display: flex;
  overflow: hidden;
  background-color: var(--surface-highest-60);
  border-radius: var(--corner-full);
  outline: var(--stroke-subtle) solid var(--border-muted);
}

.content {
  position: relative;
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  transition: opacity 0.3s var(--ease-emphasized);

  &--is-not-ready {
    opacity: 0;
  }
}

.tab-list {
  @include fade-mask(to right);
  position: relative;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}

.tab-list__items {
  display: flex;
  position: relative;
  padding: 0 var(--space-2);
}

.tab-list__indicator {
  position: absolute;
  width: 56px;
  height: 32px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-radius: var(--corner-full);
  pointer-events: none;
  transition:
    width 0.2s var(--ease-emphasized),
    transform 0.2s var(--ease-emphasized);

  &--is-not-ready {
    transition: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    right: var(--space-2);
    left: var(--space-2);
    opacity: var(--opacity-20);
    border-radius: inherit;
    background-color: var(--accent);
  }
}
</style>
