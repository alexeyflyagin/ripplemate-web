<script setup lang="ts">
import type { Component } from 'vue'

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
  width: 48px;
  height: 48px;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: var(--corner-full);
  color: var(--text-muted);
  cursor: pointer;

  &:focus-visible {
    outline: none;

    &::after {
      @include focus-outline;
      content: '';
      position: absolute;
      border-radius: inherit;
      inset: var(--space-4);
    }
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
