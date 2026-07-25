<script setup lang="ts">
import type { Component } from 'vue'

const selected = defineModel<boolean>('selected', {
  default: false,
})

defineProps<{
  icon: Component
  iconSelected: Component
}>()
</script>

<template>
  <button
    class="toggable-icon-button"
    :class="{ 'toggable-icon-button--selected': selected }"
    @click.stop="selected = !selected"
    @contextmenu.prevent
  >
    <span class="toggable-icon-button__icon-container">
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

.toggable-icon-button {
  position: relative;
  display: inline-flex;
  width: 36px;
  height: 36px;
  border: none;
  padding: 0;
  border-radius: var(--corner-full);
  color: var(--text-muted);
  background-color: transparent;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--accent);
    opacity: 0;
  }

  @media (hover: hover) {
    &:hover::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    @include focus-outline;
    outline-offset: 0;

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &:active::after {
    opacity: var(--opacity-8);
  }

  &--selected {
    color: var(--error);
  }

  &__icon-container {
    width: 18px;
    height: 18px;
    margin: auto;
  }
}
</style>
