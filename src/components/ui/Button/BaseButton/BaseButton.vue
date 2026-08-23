<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    icon?: Component
    variant?: 'default' | 'accent' | 'danger-text'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    type: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="base-button"
    :class="`base-button--${variant}`"
    :disabled="disabled"
    :type="type"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <div class="base-button__content">
      <component class="base-button__icon" :is="icon" />
      <span class="base-button__label">{{ label }}</span>
    </div>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/mixins' as *;

.base-button {
  @include text-label-emphasized;
  position: relative;
  display: inline-flex;
  justify-content: center;
  background-color: transparent;
  padding: var(--space-12) var(--space-16);
  border-radius: var(--corner-xlarge);
  border: none;
  color: var(--text-muted);
  user-select: none;
  cursor: pointer;

  &::after {
    content: ' ';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: var(--accent);
    opacity: 0;
  }

  &__content {
    display: inline-flex;
    gap: var(--space-8);
    align-items: center;
    z-index: 1;
    transition: transform 0.35s var(--ease-bounce);
  }

  &__icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    align-self: center;
  }

  &__label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }

  @media (hover: hover) {
    &:hover::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    @include focus-outline;

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &:active {
    .base-button__content {
      transform: scale(0.94);
      transition: transform 0.08s ease-out;
    }
  }

  &:disabled {
    opacity: var(--opacity-40);
    pointer-events: none;
  }
}

.base-button--accent {
  color: var(--bg);
  background-color: var(--accent);

  @media (hover: hover) {
    &:hover::after {
      background-color: var(--white);
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible::after {
    background-color: var(--white);
    opacity: var(--opacity-10);
  }
}

.base-button--danger-text {
  color: var(--error);

  @media (hover: hover) {
    &:hover::after {
      background-color: var(--error);
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible::after {
    background-color: var(--error);
    opacity: var(--opacity-10);
  }
}
</style>
