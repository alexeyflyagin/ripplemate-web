<script setup lang="ts">
import CardItemTogglableIconButton from './CardItemTogglableIconButton.vue'
import HeartIcon from '~icons/icons-16/heart'
import HeartFilledIcon from '~icons/icons-16/heart-filled'
import type { CardPosition } from './CardList.types.ts'

const isFavorite = defineModel<boolean>('isFavorite', {
  default: false,
})

withDefaults(
  defineProps<{
    term: string
    timeLabel: string
    position?: CardPosition
  }>(),
  {
    position: 'middle',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
  contextmenu: [event: MouseEvent]
}>()
</script>

<template>
  <div>
    <button
      class="card-item"
      :class="{
        [`card-item--${position}`]: position !== 'middle',
      }"
      @click="emit('click', $event)"
      @contextmenu.prevent="emit('contextmenu', $event)"
    >
      <CardItemTogglableIconButton
        :icon="HeartIcon"
        :icon-selected="HeartFilledIcon"
        v-model:selected="isFavorite"
      />
      <span class="card-item__term">{{ term }}</span>
      <span class="card-item__time-label">{{
        timeLabel
      }}</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/mixins' as *;

.card-item {
  @include text-label;
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0;
  border: none;
  color: var(--text);
  background-color: var(--surface);
  border-radius: var(--corner-small);
  padding: 0;
  transition: transform 0.2s var(--ease-standard);
  user-select: none;
  cursor: pointer;

  &--first {
    border-top-left-radius: var(--corner-large);
    border-top-right-radius: var(--corner-large);
  }

  &--last {
    border-bottom-left-radius: var(--corner-large);
    border-bottom-right-radius: var(--corner-large);
  }

  &--only-one {
    border-radius: var(--corner-large);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--text);
    opacity: 0;
    pointer-events: none;
  }

  &:focus-visible {
    @include focus-outline;
    outline-offset: 0px;
  }

  &:active {
    transform: scale(0.99);
  }

  &__term {
    margin: var(--space-8) var(--space-16) var(--space-8)
      var(--space-2);
    flex-grow: 1;
    text-align: left;
  }

  &__time-label {
    @include text-label;
    margin-right: var(--space-12);
    color: var(--text-placeholder);
  }
}
</style>
