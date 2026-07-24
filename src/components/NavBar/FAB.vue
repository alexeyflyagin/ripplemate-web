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
  <button class="fab" @click="emit('click', $event)">
    <span class="fab__icon-container">
      <component :is="icon" width="100%" height="100%" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/shadows' as *;

.fab {
  @include elevation-2;
  position: relative;
  display: inline-flex;
  width: 52px;
  height: 52px;
  padding: 0;
  background-color: var(--surface);
  border: none;
  outline: var(--stroke-subtle) solid var(--border-muted);
  border-radius: var(--corner-full);
  color: var(--text-muted);
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

  &:active {
    color: var(--text);

    &::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    @include focus-outline;
    outline-offset: calc(var(--space-2) * -1);
    color: var(--text);

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &--selected {
    color: var(--accent);
  }
}

.fab__icon-container {
  position: relative;
  flex-shrink: 0;
  margin: auto;
  width: 18px;
  height: 18px;
}
</style>
