<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{
    icon: Component
    color?: 'default' | 'accent' | 'danger'
    disabled?: boolean
  }>(),
  {
    color: 'default',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="circle-button"
    :disabled="disabled"
    :class="{
      'circle-button--accent': props.color === 'accent',
      'circle-button--danger': props.color === 'danger',
    }"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <div class="circle-button__content">
      <span class="circle-button__icon-container">
        <component :is="icon" width="100%" height="100%" />
      </span>
    </div>
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
      transform: scale(0.8);
    }
  }

  &:focus-visible {
    @include focus-outline;
    outline-offset: calc(var(--space-2) * -1);

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &--accent {
    color: var(--bg);

    &::after {
      background-color: var(--bg);
    }

    & .circle-button__content {
      background-color: var(--accent);
    }

    &:disabled {
      &::after {
        background-color: var(--text);
        opacity: var(--opacity-4);
      }
    }
  }

  &--danger {
    color: var(--error);

    &::after {
      background-color: var(--error);
    }
  }

  &:disabled {
    color: var(--text);
    pointer-events: none;

    & .circle-button__content {
      background-color: transparent;
    }

    & .circle-button__icon-container {
      opacity: var(--opacity-30);
    }
  }
}

.circle-button__content {
  position: relative;
  display: inline-flex;
  margin: auto;
  border-radius: inherit;
  width: 44px;
  height: 44px;
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
