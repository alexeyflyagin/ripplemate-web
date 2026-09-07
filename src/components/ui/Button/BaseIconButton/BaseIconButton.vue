<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="base-icon-button"
    :disabled="disabled"
    type="button"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <component class="base-icon-button__icon" :is="icon" />
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.base-icon-button {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  color: var(--text-muted);
  width: 40px;
  height: 40px;
  border: none;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--corner-large);
  background-color: transparent;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    inset: 0;
    background-color: var(--text);
    opacity: 0;
  }

  &__icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s var(--ease-bounce);
  }

  @media (hover: hover) {
    &:hover::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    @include focus-outline;

    &::after {
      opacity: var(--opacity-8);
    }
  }

  &:active .base-icon-button__icon {
    transform: scale(0.86);
    transition: transform 0.08s ease-out;
  }

  &:disabled {
    opacity: var(--opacity-40);
    pointer-events: none;
  }
}
</style>
