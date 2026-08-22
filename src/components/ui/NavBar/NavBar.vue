<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import type { NavItemData } from './NavBar.types.ts'
import NavItem from './NavItem.vue'
import { NAV_ITEM_SIZE } from './NavBar.constants.ts'
import { nextPaint } from '@/utils/nextPaint.ts'

const selectedId = defineModel<string>('selectedId', {
  required: true,
})

const props = defineProps<{
  navItems: NavItemData[]
}>()

const navIndicatorEl = ref<HTMLElement>()
const navContainerEl = ref<HTMLElement>()
const navIndicatorOffset = ref<number>(0)
const selectedIndex = computed<number>(() => {
  return props.navItems.findIndex(
    (v) => v.id === selectedId.value,
  )
})
const isDragging = ref<boolean>(false)
const isReady = ref<boolean>(false)
let startOffset = 0
let startX = 0

watch(selectedId, () => {
  if (isDragging.value) return
  updateNavIndicatorOffset()
})

function updateNavIndicatorOffset() {
  if (!navIndicatorEl.value) return

  navIndicatorOffset.value =
    navIndicatorEl.value.offsetWidth * selectedIndex.value
}

function checkBoundaries(offset: number): number {
  if (!navIndicatorEl.value || !navContainerEl.value)
    return offset

  const indicatorWidth = navIndicatorEl.value.offsetWidth
  const containerWidth = navContainerEl.value.offsetWidth

  const maxOffset = containerWidth - indicatorWidth

  if (offset > maxOffset) return maxOffset
  if (offset < 0) return 0
  return offset
}

function getClosestNavItemId(): string {
  if (!navIndicatorEl.value || !navContainerEl.value)
    return selectedId.value

  const index = Math.round(
    navIndicatorOffset.value /
      navIndicatorEl.value.offsetWidth,
  )
  return props.navItems[index]?.id ?? selectedId.value
}

function onPointerDown(event: PointerEvent) {
  if (isDragging.value) return
  isDragging.value = true
  startOffset = navIndicatorOffset.value
  startX = event.clientX
  ;(event.target as HTMLElement).setPointerCapture(
    event.pointerId,
  )
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return
  const offset = event.clientX - startX
  navIndicatorOffset.value = checkBoundaries(
    startOffset + offset,
  )
}

function onPointerUp() {
  if (!isDragging.value) return
  isDragging.value = false
  selectedId.value = getClosestNavItemId()
  updateNavIndicatorOffset()
}

onMounted(async () => {
  await nextTick()
  updateNavIndicatorOffset()
  await nextPaint()
  isReady.value = true
})
</script>

<template>
  <div class="nav-bar">
    <div ref="navContainerEl" class="nav-bar__nav-items">
      <NavItem
        v-for="item in navItems"
        :key="item.id"
        v-bind="item"
        :selected="item.id === selectedId"
        @click="selectedId = item.id"
      />
      <div
        class="nav-bar__active-indicator-container"
        :class="{
          'nav-bar__active-indicator-container--is-dragging':
            isDragging,
          'nav-bar__active-indicator-container--is-not-ready':
            !isReady,
        }"
        ref="navIndicatorEl"
        :style="{
          transform: `translateX(${navIndicatorOffset}px)`,
          width: NAV_ITEM_SIZE + 'px',
          height: NAV_ITEM_SIZE + 'px',
        }"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointermove="onPointerMove"
      >
        <div
          class="nav-bar__active-indicator-container__indicator"
          :class="{
            'nav-bar__active-indicator-container__indicator--is-dragging':
              isDragging,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/blur' as *;

.nav-bar {
  @include elevation-2;
  @include background-blur-6;
  position: relative;
  display: inline-flex;
  border-radius: var(--corner-full);
  background-color: var(--surface-60);
  outline: var(--stroke-subtle) solid var(--border-muted);
  overflow: hidden;
}

.nav-bar__active-indicator-container {
  position: absolute;
  display: inline-flex;
  left: 0;
  touch-action: none;
  transition: transform 0.2s ease;
  cursor: pointer;

  &--is-dragging {
    transition: none;
  }

  &--is-not-ready {
    transition: none;
  }

  &__indicator {
    width: 44px;
    height: 44px;
    margin: auto;
    border-radius: var(--corner-full);
    background-color: var(--accent);
    opacity: var(--opacity-20);
    pointer-events: none;
    transition: transform 0.2s ease;

    &--is-dragging {
      transform: scale(1.1);
    }
  }
}
</style>
