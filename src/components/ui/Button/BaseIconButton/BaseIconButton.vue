<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { CircularProgressBar } from '@/components/ui/ProgressBar/CircularProgressBar'

const selected = defineModel<boolean>('selected', {
  default: false,
})

const visible = defineModel<boolean>('visible', {
  default: true,
})

const props = withDefaults(
  defineProps<{
    icon: Component
    iconSelected?: Component
    selectable?: boolean
    loading?: boolean
    size?: 'default' | 'small'
    variant?:
      | 'default'
      | 'accent'
      | 'accent-text'
      | 'danger'
    showSelectedBackground?: boolean
    disabled?: boolean
    hide?: boolean
    initAnimation?: boolean
  }>(),
  {
    variant: 'default',
    size: 'default',
    showSelectedBackground: true,
    hide: false,
    initAnimation: false,
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

const animateOnShow = ref<boolean>(props.initAnimation)

function onAnimationEnd(event: AnimationEvent) {
  const name = event.animationName
  if (name.startsWith('base-icon-button-hide')) {
    visible.value = false
  }
}

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

watch(
  () => props.hide,
  (v) => {
    if (!v) visible.value = true
  },
  { immediate: true },
)

watch(
  () => props.hide,
  (v, oldV) => {
    if (!v) visible.value = true
    if (oldV !== undefined) animateOnShow.value = true
  },
  { immediate: true },
)
</script>

<template>
  <button
    v-if="visible"
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
      'base-icon-button--hide': hide,
      'base-icon-button--show': !hide && animateOnShow,
    }"
    :disabled="disabled"
    type="button"
    @click.stop="onClick"
    @contextmenu.prevent
    @animationend="onAnimationEnd"
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

.base-icon-button--accent-text {
  color: var(--accent);

  &.base-icon-button--show-selected-background {
    &.base-icon-button--selected {
      background-color: var(--accent-10);
    }
  }

  &:hover::after {
    background-color: var(--accent);
  }

  &:disabled {
    color: var(--text);

    &.base-icon-button--selected {
      background-color: transparent;
    }
  }
}

.base-icon-button--show {
  animation: base-icon-button-show 0.15s
    var(--ease-emphasized) forwards;
}

@keyframes base-icon-button-show {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.base-icon-button--hide {
  animation: base-icon-button-hide 0.15s
    var(--ease-emphasized) forwards;
  pointer-events: none;
}

@keyframes base-icon-button-hide {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
