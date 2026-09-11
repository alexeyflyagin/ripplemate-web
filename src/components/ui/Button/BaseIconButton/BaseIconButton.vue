<script setup lang="ts">
import { computed, watch, type Component } from 'vue'
import { CircularProgressBar } from '@/components/ui/ProgressBar/CircularProgressBar'

const selected = defineModel<boolean>('selected', {
  default: false,
})

const props = withDefaults(
  defineProps<{
    icon: Component
    iconSelected?: Component
    selectable?: boolean
    loading?: boolean
    size?: 'default' | 'small'
    variant?: 'default' | 'accent' | 'danger'
    showSelectedBackground?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    size: 'default',
    showSelectedBackground: true,
  },
)

const progressBarSize = computed<number>(() => {
  switch (props.size) {
    case 'default':
      return 18
    case 'small':
      return 16
  }
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function onClick(event: MouseEvent) {
  if (props.loading) return
  if (props.selectable) selected.value = !selected.value
  emit('click', event)
}

watch(
  [() => props.selectable, selected],
  ([newSelectable]) => {
    if (!newSelectable) selected.value = false
  },
  { immediate: true },
)
</script>

<template>
  <button
    class="base-icon-button"
    :class="{
      [`base-icon-button--size-${size}`]:
        size !== 'default',
      [`base-icon-button--${variant}`]:
        variant !== 'default',
      'base-icon-button--selected': selected,
      'base-icon-button--loading': loading,
      'base-icon-button--show-selected-background':
        showSelectedBackground,
    }"
    :disabled="disabled"
    type="button"
    @click="onClick"
    @contextmenu.prevent
  >
    <span v-if="!loading" class="base-icon-button__icon">
      <component
        width="100%"
        height="100%"
        :is="selected && iconSelected ? iconSelected : icon"
      />
    </span>

    <CircularProgressBar
      v-else
      class="base-icon-button__progress-bar"
      :size="progressBarSize"
    />
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.base-icon-button {
  position: relative;
  display: inline-flex;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: none;
  border-radius: var(--corner-large);
  background-color: transparent;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--text);
    opacity: 0;
  }

  &.base-icon-button--show-selected-background {
    &.base-icon-button--selected {
      background-color: var(--accent-10);
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s var(--ease-bounce);
  }

  &__progress-bar {
    --indicator-color: var(--text-muted);
  }

  @media (hover: hover) {
    &:hover::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    @include focus-outline;
  }

  &:active .base-icon-button__icon {
    transform: scale(0.86);
    transition: transform 0.08s ease-out;
  }

  &:disabled {
    pointer-events: none;

    & .base-icon-button__progress-bar {
      opacity: var(--opacity-40);
    }

    &.base-icon-button--selected {
      background-color: transparent;
    }

    &.base-icon-button--show-selected-background {
      &.base-icon-button--selected::after {
        background-color: var(--text);
        opacity: var(--opacity-10);
      }
    }

    .base-icon-button__icon {
      opacity: var(--opacity-40);
    }
  }
}

.base-icon-button--size {
  &-small {
    width: 34px;
    height: 34px;

    .base-icon-button__icon {
      width: 16px;
      height: 16px;
    }
  }
}

.base-icon-button--accent {
  background-color: var(--accent);
  color: var(--bg);

  &::after {
    background-color: var(--bg);
  }

  & .base-icon-button__progress-bar {
    --indicator-color: var(--bg);
    --track-color: transparent;
  }

  &.base-icon-button--show-selected-background {
    &.base-icon-button--selected {
      background-color: var(--accent);
    }
  }

  &:disabled {
    background-color: transparent;
    color: var(--text);

    &::after {
      background-color: var(--text);
      opacity: var(--opacity-8);
    }

    & .base-icon-button__progress-bar {
      --indicator-color: var(--text);
    }

    &.base-icon-button--selected {
      background-color: transparent;
    }

    &.base-icon-button--show-selected-background {
      &.base-icon-button--selected::after {
        opacity: var(--opacity-20);
      }
    }
  }
}

.base-icon-button--danger {
  color: var(--error);

  &.base-icon-button--show-selected-background {
    &.base-icon-button--selected {
      background-color: var(--error-10);
    }
  }

  &:hover::after {
    background-color: var(--error);
  }

  &:disabled {
    color: var(--text);

    &.base-icon-button--selected {
      background-color: transparent;
    }
  }
}
</style>
