<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NavItemData } from './NavBar.types.ts'
import NavItem from './NavItem.vue'
import { NAV_ITEM_SIZE } from './NavBar.constants.ts'
import CircleIconButton from '@/components/Buttons/CircleIconButton.vue'
import PlusIcon from '~icons/icons-16/plus'

const selectedIndex = defineModel<number>('selectedIndex', {
  default: 0,
})

defineProps<{
  navItems: NavItemData[]
}>()

const emit = defineEmits<{
  addClick: [event: MouseEvent]
}>()

const navIndicatorEl = ref<HTMLElement>()
const navContainerEl = ref<HTMLElement>()
const navIndicatorOffset = ref<number>(0)
const isDragging = ref<boolean>(false)
let startOffset = 0
let startX = 0

watch(selectedIndex, () => {
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

function getClosestNavItemIndex(): number {
  if (!navIndicatorEl.value || !navContainerEl.value)
    return selectedIndex.value

  return Math.round(
    navIndicatorOffset.value /
      navIndicatorEl.value.offsetWidth,
  )
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
  selectedIndex.value = getClosestNavItemIndex()
  updateNavIndicatorOffset()
}
</script>

<template>
  <div class="nav-bar">
    <div ref="navContainerEl" class="nav-bar__nav-items">
      <NavItem
        v-for="(item, index) in navItems"
        :key="item.id"
        v-bind="item"
        :selected="index === selectedIndex"
        @click="selectedIndex = index"
      />
      <div
        class="nav-bar__active-indicator-container"
        :class="{
          'nav-bar__active-indicator-container--is-dragging':
            isDragging,
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
    <CircleIconButton
      :icon="PlusIcon"
      @click="emit('addClick', $event)"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;

.nav-bar {
  @include elevation-2;
  position: relative;
  display: inline-flex;
  border-radius: var(--corner-full);
  background-color: var(--surface);
  outline: var(--stroke-subtle) solid var(--border-muted);
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
