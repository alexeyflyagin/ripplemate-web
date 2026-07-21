<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    icon?: Component
    variant?: 'default' | 'accent'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    type: 'button',
  },
)

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="base-button"
    :class="`base-button--${variant}`"
    :disabled="disabled"
    :type="type"
    @click="emit('click')"
  >
    <span v-if="icon" class="base-button__icon">
      <component :is="icon" width="100%" height="100%" />
    </span>
    <span class="base-button__label">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/mixins' as *;

.base-button {
  @include text-label-emphasized;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  gap: var(--space-8);
  padding: var(--space-12) var(--space-16);
  border-radius: var(--corner-large);
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.base-button::after {
  content: ' ';
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: var(--accent);
  opacity: 0;
}
@media (hover: hover) {
  .base-button:hover::after {
    opacity: var(--opacity-8);
  }
}

.base-button:active::after {
  opacity: var(--opacity-8);
}

.base-button:focus-visible::after {
  opacity: var(--opacity-10);
}

.base-button:focus-visible {
  @include focus-outline;
}

.base-button:disabled {
  opacity: var(--opacity-40);
  pointer-events: none;
}

.base-button__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  align-self: center;
}

.base-button--accent {
  color: var(--white);
  background-color: var(--accent);
}

@media (hover: hover) {
  .base-button--accent:hover::after {
    background-color: var(--white);
    opacity: var(--opacity-8);
  }
}

.base-button--accent:active::after {
  background-color: var(--white);
  opacity: var(--opacity-8);
}

.base-button--accent:focus-visible::after {
  background-color: var(--white);
  opacity: var(--opacity-10);
}

.base-button__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
}
</style>
