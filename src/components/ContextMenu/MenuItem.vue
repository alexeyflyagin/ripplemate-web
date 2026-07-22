<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    label: string
    value?: string
    icon?: Component
    showDivider?: boolean
    color?: 'default' | 'danger'
    disabled?: boolean
    selected?: boolean
    width?: string
  }>(),
  {
    color: 'default',
  },
)

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="menu-item" :style="{ width: width }">
    <hr v-if="showDivider" class="menu-item__divider" />
    <button
      class="menu-item__button"
      :disabled="disabled"
      @click="emit('click')"
      :class="{
        'menu-item__button--selected': selected,
        [`menu-item__button--${color}`]:
          color !== 'default' && !selected,
      }"
    >
      <span
        v-if="icon"
        class="menu-item__button__icon-container"
      >
        <component :is="icon" width="100%" height="100%" />
      </span>
      <span class="menu-item__button__label">{{
        label
      }}</span>
      <span v-if="value" class="menu-item__button__value">
        {{ value }}
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.menu-item {
  position: relative;
  display: flex;
  flex-direction: column;
  vertical-align: top;
  gap: var(--space-4);
  margin: 0;
  padding: 0;

  &__divider {
    border: none;
    height: var(--stroke-subtle);
    border-radius: var(--corner-full);
    margin: var(--space-2) var(--space-8);
    background-color: var(--border-muted);
  }
}

.menu-item__button {
  position: relative;
  display: inline-flex;
  background-color: transparent;
  border: none;
  align-items: center;
  gap: var(--space-12);
  border-radius: var(--corner-medium);
  margin: 0 var(--space-4) var(--space-4);
  padding: 12px;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--accent);
    border-radius: inherit;
    opacity: 0;
  }

  &:hover {
    &::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    outline: none;

    &::after {
      opacity: var(--opacity-10);
    }
  }

  &:active {
    &::after {
      opacity: var(--opacity-8);
    }
  }

  &--selected {
    color: var(--text);

    &::after,
    &:hover::after,
    &:active::after {
      opacity: var(--opacity-20);
    }

    &:focus-visible::after {
      opacity: var(--opacity-30);
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
    opacity: var(--opacity-40);
    pointer-events: none;
  }
}

// inner elements (label/value/icon)
.menu-item__button {
  &__label {
    @include text-caption-emphasized;
    text-align: start;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__value {
    @include text-label;
    color: var(--text-placeholder);
    text-align: end;
    flex-grow: 1;
    min-width: 24px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__icon-container {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}
</style>
