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
    <component
      class="nav-item__icon"
      :is="selected ? iconSelected : icon"
    />
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
    outline-offset: -4px;
  }

  &:active .nav-item__icon {
    transform: scale(0.86);
    transition: transform 0.08s ease-out;
  }

  &--selected {
    color: var(--accent);
  }
}

.nav-item__icon {
  position: relative;
  flex-shrink: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  transition: transform 0.3s var(--ease-bounce);
}
</style>
