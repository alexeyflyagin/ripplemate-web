<script setup lang="ts">
import CaretDown from '~icons/icons-12/caret-down'

defineProps<{
  label: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent, isSelected: boolean]
}>()

const selected = defineModel<boolean>('selected', {
  default: false,
})

function onClick(e: MouseEvent) {
  selected.value = !selected.value
  emit('click', e, !selected.value)
}
</script>

<template>
  <button
    class="drop-down"
    :class="{ 'drop-down--selected': selected }"
    :disabled="disabled"
    @click="onClick"
    @contextmenu.prevent="onClick"
  >
    <div class="drop-down__content">
      <span class="drop-down__label">{{ label }}</span>
      <CaretDown class="drop-down__icon" />
    </div>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/mixins' as *;

.drop-down {
  @include text-caption-emphasized;
  position: relative;
  height: 40px;
  display: inline-flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border: none;
  overflow: hidden;
  border-radius: var(--corner-large);
  padding: 0 var(--space-12);
  color: var(--text);
  user-select: none;
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
      opacity: var(--opacity-4);
    }
  }

  &:focus-visible {
    @include focus-outline;

    &::after {
      opacity: var(--opacity-8);
    }
  }

  &:active .drop-down__content {
    transform: scale(0.94);
    transition: transform 0.08s ease-out;
  }

  &--selected {
    &::after {
      opacity: var(--opacity-8);
    }

    & .drop-down__icon {
      transform: rotate(180deg);
      color: var(--text);
    }
  }
}

.drop-down__content {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-4);
  transition: transform 0.3s var(--ease-bounce);
}

.drop-down__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.drop-down__icon {
  display: inline-flex;
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  color: var(--text-placeholder);
  transition: transform 0.1s var(--ease-emphasized);
}
</style>
