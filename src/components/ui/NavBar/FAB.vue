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
    class="fab"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <component class="fab__icon" :is="icon" />
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/blur' as *;

.fab {
  @include elevation-1;
  @include background-blur-15;
  position: relative;
  display: inline-flex;
  width: 48px;
  height: 48px;
  padding: 0;
  background-color: var(--surface-highest-80);
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
    .fab__icon {
      transform: scale(0.86);
      transition: transform 0.08s ease-out;
    }
  }

  &:focus-visible {
    @include focus-outline;
    color: var(--text);
  }

  &--selected {
    color: var(--accent);
  }
}

.fab__icon {
  position: relative;
  flex-shrink: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  transition: transform 0.3s var(--ease-bounce);
}
</style>
