<script setup lang="ts">
import CaretDown from '~icons/icons-12/caret-down'

const selected = defineModel<boolean>('selected', {
  default: false,
})

defineProps<{
  label: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent, isSelected: boolean]
}>()
</script>

<template>
  <button
    class="drop-down"
    :class="{ 'drop-down--selected': selected }"
    :disabled="disabled"
    @click="
      (event) => {
        emit('click', event, !selected)
        selected = !selected
      }
    "
    @contextmenu.prevent="
      (event) => {
        emit('click', event, !selected)
        selected = !selected
      }
    "
  >
    <span class="drop-down__label">{{ label }}</span>
    <span class="drop-down__icon">
      <CaretDown
        class="drop-down__icon__caret"
        width="100%"
        height="100%"
      />
    </span>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/mixins' as *;

.drop-down__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: transform 0.2s var(--ease-standard);
}

.drop-down__icon {
  display: inline-flex;
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  color: var(--text-placeholder);
  transition: transform 0.15s ease;
}

.drop-down {
  @include text-caption-emphasized;
  position: relative;
  min-height: 40px;
  min-width: 100px;
  display: inline-flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  gap: var(--space-4);
  border: none;
  overflow: hidden;
  border-radius: var(--corner-large);
  padding: 0 var(--space-12);
  color: var(--text-muted);
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background-color: var(--text);
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
    & .drop-down__icon {
      transform: translateY(2px);
    }

    & .drop-down__label {
      transform: scale(0.96);
    }
  }

  &--selected {
    color: var(--text);

    &::after {
      opacity: var(--opacity-8);
    }

    @media (hover: hover) {
      &:hover::after {
        opacity: var(--opacity-8);
      }
    }

    &:focus-visible::after,
    &:active::after {
      opacity: var(--opacity-8);
    }

    & .drop-down__icon {
      transform: rotate(180deg);
    }
  }

  &:disabled {
    opacity: var(--opacity-40);
    color: var(--text);
    pointer-events: none;
  }
}
</style>
