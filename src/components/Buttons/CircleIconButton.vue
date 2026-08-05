<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="circle-button"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <span class="circle-button__icon-container">
      <component :is="icon" width="100%" height="100%" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.circle-button {
  position: relative;
  display: inline-flex;
  width: 52px;
  height: 52px;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: var(--corner-full);
  color: var(--text-muted);
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: var(--space-4);
    border-radius: inherit;
    background-color: var(--text);
    opacity: 0;
  }

  @media (hover: hover) {
    &:hover::after {
      opacity: var(--opacity-8);
    }
  }

  &:active {
    .circle-button__icon-container {
      transform: scale(0.9);
    }
  }

  &:focus-visible {
    @include focus-outline;
    outline-offset: calc(var(--space-2) * -1);

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &--selected {
    color: var(--accent);
  }
}

.circle-button__icon-container {
  position: relative;
  flex-shrink: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  transition: transform 0.2s var(--ease-standard);
}
</style>
