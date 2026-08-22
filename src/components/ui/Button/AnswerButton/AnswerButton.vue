<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    color?: 'green' | 'yellow' | 'red'
    pos?: 'first' | 'middle' | 'last' | 'single'
    disabled?: boolean
    clickable?: boolean
  }>(),
  {
    pos: 'single',
    color: 'green',
    clickable: true,
  },
)

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="answer-button"
    :disabled="disabled"
    :class="{
      [`answer-button--${pos}`]: pos !== 'single',
      [`answer-button--${color}`]: color !== 'green',
      'answer-button--non-clickable': !clickable,
    }"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/text-styles' as *;

.answer-button {
  @include text-label-emphasized;
  position: relative;
  padding: var(--space-16);
  border: none;
  border-radius: var(--corner-xxlarge);
  background-color: var(--easy);
  color: var(--white);
  transition:
    transform 0.16s var(--ease-emphasized),
    opacity 0.2s var(--ease-emphasized);
  user-select: none;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--white);
    transition: opacity 0.2s var(--ease-emphasized);
    opacity: 0;
  }

  &--yellow {
    background-color: var(--good);
  }

  &--red {
    background-color: var(--hard);
  }

  &--first {
    border-radius: var(--corner-xxlarge) var(--corner-large)
      var(--corner-large) var(--corner-xxlarge);
  }

  &--middle {
    border-radius: var(--corner-large);
  }

  &--last {
    border-radius: var(--corner-large) var(--corner-xxlarge)
      var(--corner-xxlarge) var(--corner-large);
  }

  @media (hover: hover) {
    &:hover::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    @include focus-outline;
  }

  &:active {
    transform: scale(0.94);
  }

  &--non-clickable {
    pointer-events: none;
  }

  &:disabled {
    pointer-events: none;
    opacity: var(--opacity-20);
    transform: scale(0.9);
  }
}
</style>
