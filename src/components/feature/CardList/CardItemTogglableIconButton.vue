<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  iconSelected: Component
  selected?: boolean
}>()
</script>

<template>
  <button
    class="togglable-icon-button"
    :class="{ 'togglable-icon-button--selected': selected }"
    @contextmenu.prevent
  >
    <span class="togglable-icon-button__icon-container">
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

.togglable-icon-button {
  position: relative;
  display: inline-flex;
  width: 34px;
  height: 34px;
  border: none;
  flex-shrink: 0;
  padding: 0;
  border-radius: var(--corner-full);
  color: var(--text-muted);
  background-color: transparent;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: inherit;
    background-color: var(--accent);
    opacity: 0;
  }

  @media (hover: hover) {
    &:hover::after {
      opacity: var(--opacity-4);
    }
  }

  &:focus-visible {
    @include focus-outline;
    outline-offset: -2px;

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &:active {
    .togglable-icon-button__icon-container {
      transform: scale(0.8);
      transition: transform 0.08s ease-out;
    }
  }

  &--selected {
    color: var(--error);
  }

  &__icon-container {
    width: 16px;
    height: 16px;
    margin: auto;
    transition: transform 0.3s var(--ease-bounce);
  }
}
</style>
