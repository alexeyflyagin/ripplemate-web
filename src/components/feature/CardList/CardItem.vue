<script setup lang="ts">
import CardItemTogglableIconButton from './CardItemTogglableIconButton.vue'
import HeartIcon from '~icons/icons-16/heart'
import HeartFilledIcon from '~icons/icons-16/heart-filled'
import type { CardPosition } from './CardList.types.ts'

withDefaults(
  defineProps<{
    term: string
    timeLabel: string
    position?: CardPosition
    isFavorite?: boolean
    isNew?: boolean
    isLeaving?: boolean
  }>(),
  {
    position: 'middle',
    isFavorite: false,
    isNew: false,
    isLeaving: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
  contextmenu: [event: MouseEvent]
  enterDone: []
  leaveDone: []
  toggleFavorite: []
}>()

function onAnimationEnd(event: AnimationEvent) {
  const name = event.animationName
  if (name.startsWith('card-item-enter')) {
    emit('enterDone')
  } else if (name.startsWith('card-item-leave')) {
    emit('leaveDone')
  }
}
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
        'card-item--new': isNew,
        'card-item--leaving': isLeaving,
      }"
      @animationend="onAnimationEnd"
    >
      <CardItemTogglableIconButton
        :icon="HeartIcon"
        :icon-selected="HeartFilledIcon"
        :selected="isFavorite"
        :style="{ 'margin-top': '2px' }"
        @click.stop="emit('toggleFavorite')"
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

  &:active {
    .card-item {
      transform: scale(0.97);
      transition: transform 0.08s ease-out;
    }
  }
}

.card-item {
  @include text-caption;
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  max-width: 100%;
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
  transition: transform 0.3s var(--ease-bounce);

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
    min-width: 0;
    text-align: left;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 20;
    line-clamp: 20;
    overflow: hidden;
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

.card-item--new {
  animation: card-item-enter 0.5s var(--ease-bounce);
  transform-origin: left bottom;
}

@keyframes card-item-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.card-item--leaving {
  animation: card-item-leave 0.2s var(--ease-emphasized)
    forwards;
  pointer-events: none;
  transform-origin: left bottom;
}

@keyframes card-item-leave {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
</style>
