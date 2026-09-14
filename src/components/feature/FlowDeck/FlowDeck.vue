<script setup lang="ts">
import { ref } from 'vue'
import FlowCard from './FlowCard.vue'
import type {
  AnswerType,
  DeckState,
  FlowCardData,
} from './FlowDeck.types'
import { useDeckBehavior } from './useDeckBehavior'
import {
  useCardPresenter,
  CARD_TRANSITION_MS,
} from './useCardPresenter'
import { EmptyState } from '@/components/feature/EmptyState'
import NoCardsYetIcon from '~icons/icons-80/no-cards-yet'
import { CircularProgressBar } from '@/components/ui/ProgressBar/CircularProgressBar'
import { useI18n } from 'vue-i18n'
import { useResizeObserver } from '@vueuse/core'

const { t } = useI18n()

withDefaults(
  defineProps<{
    state?: DeckState
  }>(),
  {
    state: 'card',
  },
)

const emit = defineEmits<{
  answer: [data: FlowCardData, type: AnswerType]
  nextCard: []
}>()

const {
  flowCardRef,
  cardData,
  cardState,
  isAnimated,
  isTouchable,
  answer,
  showNextCard,
} = useCardPresenter({
  onAnswer: (data, type) => emit('answer', data, type),
  onNextCard: () => emit('nextCard'),
  onReset: () => reset(),
})

const {
  cardOffset,
  progress,
  isDragging,
  onPointerDown,
  onWheel,
  reset,
} = useDeckBehavior(answer)

const deckEl = ref<HTMLElement>()
const deckHeight = ref(0)

useResizeObserver(deckEl, () => {
  deckHeight.value = deckEl.value?.offsetHeight ?? 0
})

defineExpose({ showNextCard })
</script>

<template>
  <div ref="deckEl" class="flow-deck" :draggable="false">
    <FlowCard
      v-if="state === 'card' && cardData"
      ref="flowCardRef"
      class="flow-card"
      :class="{
        [`flow-card--${cardState}`]:
          cardState !== 'pending',
        'flow-card--touchable': isTouchable,
        'flow-card--is-dragging': isDragging,
        'flow-card--animated': isAnimated,
      }"
      :data="cardData"
      :animated="isAnimated"
      :progress="progress"
      :style="{
        '--card-flow-height': deckHeight,
        '--card-offset': cardOffset,
        '--progress': progress,
        '--change-state-duration': `${CARD_TRANSITION_MS}ms`,
      }"
      @pointerdown="onPointerDown"
      @wheel="onWheel"
      @answer="answer"
    />
    <CircularProgressBar
      v-else-if="state === 'card'"
      class="circle-progress"
      :delay="1000"
    />
    <EmptyState
      v-else
      class="empty-state"
      :icon="NoCardsYetIcon"
      :title="t('main.noCardsYetTitle')"
      :subtitle="t('main.noCardsYetSubtitle')"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;

.flow-deck {
  position: relative;
  overflow: hidden;
  min-width: 300px;
  min-height: 300px;
  background-color: var(--bg);
}

.circle-progress {
  position: absolute;
  inset: 0;
  justify-content: center;
  align-items: center;
  padding-top: var(--main-header-height);
  padding-bottom: var(--bottom-navigation-height);
}

.empty-state {
  position: absolute;
  inset: 0;
  padding-top: var(--main-header-height);
  padding-bottom: var(--bottom-navigation-height);
}

.flow-card,
.flow-card * {
  touch-action: none;
}

.flow-card {
  @include elevation-1;
  position: absolute;
  inset: 0;
  outline: var(--stroke-default) solid var(--border-muted);
  max-width: var(--max-content-width-400);
  margin: auto;
  padding-top: var(--main-header-height);
  padding-right: var(--space-32);
  padding-left: var(--space-32);
  padding-bottom: calc(
    var(--bottom-navigation-height) + var(--space-24)
  );
  transform: translateY(calc(var(--card-offset) * 1px))
    scale(calc((1 - var(--progress)) * 0.04 + 0.96));
  border-radius: calc(
    var(--corner-xxlarge) * min(var(--progress) * 5, 1)
  );
  pointer-events: none;

  &--animated {
    transition:
      transform var(--change-state-duration)
        var(--ease-emphasized),
      border-radius 0.2s var(--ease-emphasized);
  }

  &--initial {
    transform: translateY(
        calc(var(--card-flow-height) * 1px)
      )
      scale(0.96);
  }

  &--answered {
    transform: translateY(
        calc(var(--card-flow-height) * -1px)
      )
      scale(0.96);
  }

  &--touchable {
    pointer-events: auto;
  }

  &--is-dragging {
    transition: none;
  }
}
</style>
