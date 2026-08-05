<script setup lang="ts">
import type { Component } from 'vue'
import { NAV_ITEM_SIZE } from './NavBar.constants'

defineProps<{
  icon: Component
  iconSelected: Component
  selected?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="nav-item"
    :class="{
      'nav-item--selected': selected,
    }"
    :style="{
      width: NAV_ITEM_SIZE + 'px',
      height: NAV_ITEM_SIZE + 'px',
    }"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <span class="nav-item__icon-container">
      <component
        :is="selected ? iconSelected : icon"
        width="100%"
        height="100%"
      />
    </span>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.nav-item {
  position: relative;
  display: inline-flex;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: var(--corner-full);
  color: var(--text-muted);
  cursor: pointer;

  &:focus-visible {
    @include focus-outline;
    outline-offset: calc(var(--space-4) * -1);
  }

  &:active .nav-item__icon-container {
    transform: scale(0.9);
  }

  &--selected {
    color: var(--accent);
  }
}

.nav-item__icon-container {
  position: relative;
  flex-shrink: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  transition: transform 0.2s var(--ease-standard);
}
</style>
