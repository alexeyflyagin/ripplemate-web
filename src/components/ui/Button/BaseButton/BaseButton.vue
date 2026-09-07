<script setup lang="ts">
import type { Component } from 'vue'
import { CircularProgressBar } from '@/components/ui/ProgressBar/CircularProgressBar'

withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    loading?: boolean
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
    :class="{
      [`base-button--${variant}`]: variant !== 'default',
    }"
    :disabled="disabled"
    :type="type"
    @click="emit('click', $event)"
    @contextmenu.prevent
  >
    <CircularProgressBar
      v-if="loading"
      class="base-button__progress-bar"
      :size="14"
      :width="2"
    />
    <div v-else class="base-button__content">
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
  min-height: 40px;
  background-color: transparent;
  padding: var(--space-12) var(--space-16);
  border-radius: var(--corner-large);
  border: none;
  color: var(--text-muted);
  user-select: none;
  cursor: pointer;

  &::after {
    content: ' ';
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
    pointer-events: none;

    .base-button__content {
      opacity: var(--opacity-40);
      color: var(--text);
    }
  }
}

.base-button__progress-bar {
  --indicator-color: var(--bg);
}

.base-button--accent {
  color: var(--bg);
  background-color: var(--accent);

  @media (hover: hover) {
    &:hover::after {
      background-color: white;
    }
  }

  &:focus-visible::after {
    background-color: white;
  }

  &:disabled {
    background-color: transparent;

    &::after {
      background-color: var(--text);
      opacity: var(--opacity-8);
    }

    .base-button__content {
      opacity: var(--opacity-40);
      color: var(--text);
    }
  }
}

.base-button--danger-text {
  color: var(--error);

  @media (hover: hover) {
    &:hover::after {
      background-color: var(--error);
    }
  }

  &:focus-visible::after {
    background-color: var(--error);
  }
}

.base-button__content {
  display: inline-flex;
  gap: var(--space-8);
  align-items: center;
  z-index: 1;
  transition: transform 0.35s var(--ease-bounce);
}

.base-button__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  align-self: center;
}

.base-button__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
}

.base-button__progress-bar {
  --track-color: transparent;
}
</style>
