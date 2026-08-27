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
  click: [event: MouseEvent | KeyboardEvent]
  contextmenu: [event: MouseEvent]
}>()
</script>

<template>
  <div
    class="card-item-row"
    tabindex="0"
    role="button"
    @click="emit('click', $event)"
    @contextmenu.prevent="emit('contextmenu', $event)"
    @keydown.enter="emit('click', $event)"
    @keydown.space.prevent="emit('click', $event)"
  >
    <div
      class="card-item"
      :class="{
        [`card-item--${position}`]: position !== 'middle',
      }"
    >
      <CardItemTogglableIconButton
        :icon="HeartIcon"
        :icon-selected="HeartFilledIcon"
        v-model:selected="isFavorite"
        :style="{ 'margin-top': '2px' }"
        @click.stop
      />
      <span class="card-item__term">{{ term }}</span>
      <span class="card-item__time-label">{{
        timeLabel
      }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/mixins' as *;

.card-item-row {
  display: flex;
  outline: none;
  cursor: pointer;

  &:focus-visible .card-item {
    @include focus-outline;
    outline-offset: 0px;
  }
}

.card-item {
  @include text-caption;
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  margin: 0;
  border: none;
  color: var(--text);
  background-color: var(--surface);
  border-top-right-radius: var(--corner-xlarge);
  border-bottom-right-radius: var(--corner-xlarge);
  border-bottom-left-radius: var(--corner-small);
  border-top-left-radius: var(--corner-small);
  transition: transform 0.3s var(--ease-bounce);
  user-select: none;

  &--first {
    border-top-left-radius: var(--corner-xlarge);
  }

  &--last {
    border-bottom-left-radius: var(--corner-xlarge);
  }

  &--only-one {
    border-radius: var(--corner-xlarge);
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

  &__term {
    margin: var(--space-8) var(--space-16) var(--space-8)
      var(--space-2);
    flex-grow: 1;
    text-align: left;
    white-space: pre-wrap;
  }

  &__time-label {
    @include text-label;
    min-height: 38px;
    align-self: flex-start;
    align-content: center;
    margin-right: var(--space-12);
    color: var(--text-placeholder);
  }
}
</style>
