<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="base-icon-button"
    :disabled="disabled"
    type="button"
  >
    <span class="base-icon-button__icon">
      <component :is="icon" width="100%" height="100%" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
@use '../assets/styles/mixins' as *;

.base-icon-button {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  color: var(--text-muted);
  width: 40px;
  height: 40px;
  border: none;
  align-items: center;
  justify-content: center;
  border-radius: var(--corner-large);
  background-color: transparent;
  cursor: pointer;
}

.base-icon-button__icon {
  width: 18px;
  height: 18px;
}

.base-icon-button::after {
  content: '';
  position: absolute;
  border-radius: inherit;
  inset: 0;
  background-color: var(--text);
  opacity: 0;
}

@media (hover: hover) {
  .base-icon-button:hover::after {
    opacity: var(--opacity-8);
  }
}

.base-icon-button:active::after {
  opacity: var(--opacity-8);
}

.base-icon-button:focus-visible::after {
  opacity: var(--opacity-8);
}

.base-icon-button:focus-visible {
  @include focus-outline;
}

.base-icon-button:disabled {
  opacity: var(--opacity-40);
  pointer-events: none;
}
</style>
