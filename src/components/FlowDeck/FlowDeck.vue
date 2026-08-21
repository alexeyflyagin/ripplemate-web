<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import FlowCard from './FlowCard.vue'
import type {
  AnswerType,
  CardState,
  DeckState,
  FlowCardData,
} from './FlowDeck.types.ts'
import { useDeckBehavior } from './useDeckBehavior.ts'
import { sleep } from '@/utils/sleep.ts'
import { nextPaint } from '@/utils/nextPaint.ts'
import EmptyState from '../EmptyState.vue'
import NoCardsYetIcon from '~icons/icons-80/no-cards-yet'
import { useI18n } from 'vue-i18n'
import CircleProgressBar from '../ProgressBar/Circle/CircleProgressBar.vue'

const {
  cardOffset,
  progress,
  isDragging,
  onPointerDown,
  reset,
  flowCardRef,
} = useDeckBehavior(answer)

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
  answer: [cardData: FlowCardData, answerType: AnswerType]
  nextcard: []
}>()

const flowDeckEl = ref<HTMLElement>()

const isAnimated = ref<boolean>(false)
const isTouchable = ref<boolean>(false)
const cardFlowHeight = ref<number>(0)

const cardData = ref<FlowCardData | undefined>()
const cardState = ref<CardState>('initial')

async function answer(answerType: AnswerType) {
  if (!cardData.value) return
  emit('answer', cardData.value, answerType)
  isTouchable.value = false
  if (answerType !== 'again') await sleep(400)
  cardState.value = 'answered'
  await sleep(400)
  emit('nextcard')
  cardData.value = undefined
}

async function showNextCard(
  data: FlowCardData | undefined,
  options?: { animation: boolean },
) {
  isAnimated.value = false
  flowCardRef.value?.reset()
  reset()
  cardState.value = 'initial'
  await nextPaint()
  cardData.value = data
  await nextTick()
  isAnimated.value = options?.animation ?? true
  cardState.value = 'pending'
  await nextPaint()
  isAnimated.value = true
  isTouchable.value = true
}

defineExpose({ showNextCard })

const flowDeckRO = new ResizeObserver(() => {
  if (!flowDeckEl.value) return
  cardFlowHeight.value = flowDeckEl.value.offsetHeight
})

onMounted(async () => {
  if (flowDeckEl.value) flowDeckRO.observe(flowDeckEl.value)
})

onUnmounted(() => {
  flowDeckRO.disconnect()
})
</script>

<template>
  <div
    class="flow-deck"
    ref="flowDeckEl"
    :draggable="false"
  >
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
      :data="cardData ?? { card_id: 0, term: 'Term' }"
      :animated="isAnimated"
      :progress="progress"
      @pointerdown="onPointerDown"
      :style="{
        '--card-flow-height': cardFlowHeight,
        '--card-offset': cardOffset,
        '--progress': progress,
      }"
      @answer="answer"
    />
    <CircleProgressBar
      v-else-if="state === 'card' && !cardData"
      class="circle-progress"
      :delay="1000"
    />
    <EmptyState
      v-else-if="state === 'empty'"
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
  padding-bottom: var(--bottom-container-height);
}

.empty-state {
  position: absolute;
  inset: 0;
  padding-top: var(--main-header-height);
  padding-bottom: var(--bottom-container-height);
}

.flow-card,
.flow-card * {
  touch-action: none;
}

.flow-card {
  @include elevation-2;
  position: absolute;
  inset: 0;
  outline: var(--stroke-default) solid var(--border-muted);
  max-width: var(--max-content-width-400);
  margin: auto;
  padding-top: var(--main-header-height);
  padding-right: var(--space-32);
  padding-left: var(--space-32);
  padding-bottom: var(--bottom-container-height);
  transform: translateY(calc(var(--card-offset) * 1px))
    scale(calc((1 - var(--progress)) * 0.04 + 0.96));
  border-radius: calc(
    var(--corner-xxlarge) * min(var(--progress) * 5, 1)
  );
  pointer-events: none;

  &--animated {
    transition:
      transform 0.4s var(--ease-standard),
      border-radius 0.2s var(--ease-standard);
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
