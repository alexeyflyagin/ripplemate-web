<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
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
    class="round-button"
    :disabled="disabled"
    :class="{
      [`round-button--${color}`]: color !== 'default',
    }"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <div class="round-button__content">
      <component class="round-button__icon" :is="icon" />
    </div>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.round-button {
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
    .round-button__icon {
      transform: scale(0.84);
      transition: transform 0.08s ease-out;
    }
  }

  &:focus-visible {
    @include focus-outline;
    outline-offset: -2px;

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &--accent {
    color: var(--bg);

    &::after {
      background-color: var(--bg);
    }

    & .round-button__content {
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

    & .round-button__content {
      background-color: transparent;
    }

    & .round-button__icon {
      opacity: var(--opacity-30);
    }
  }
}

.round-button__content {
  position: relative;
  display: inline-flex;
  margin: auto;
  border-radius: inherit;
  width: 44px;
  height: 44px;
}

.round-button__icon {
  position: relative;
  flex-shrink: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  transition: transform 0.3s var(--ease-bounce);
}
</style>
