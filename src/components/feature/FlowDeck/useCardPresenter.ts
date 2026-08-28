import { nextTick, ref } from 'vue'
import type FlowCard from './FlowCard.vue'
import type {
  AnswerType,
  CardState,
  FlowCardData,
} from './FlowDeck.types'
import { sleep } from '@/utils/sleep'
import { nextPaint } from '@/utils/nextPaint'

export const CARD_TRANSITION_MS = 400

interface CardPresenterOptions {
  onAnswer: (data: FlowCardData, type: AnswerType) => void
  onNextCard: () => void
  onReset: () => void
}

export function useCardPresenter(
  options: CardPresenterOptions,
) {
  const flowCardRef = ref<InstanceType<typeof FlowCard>>()

  const cardData = ref<FlowCardData>()
  const cardState = ref<CardState>('initial')
  const isAnimated = ref(false)
  const isTouchable = ref(false)

  let showToken = 0

  async function answer(type: AnswerType) {
    const data = cardData.value
    if (!data) return

    options.onAnswer(data, type)
    isTouchable.value = false

    if (type !== 'again') await sleep(CARD_TRANSITION_MS)
    cardState.value = 'answered'
    await sleep(CARD_TRANSITION_MS)

    cardData.value = undefined
    options.onNextCard()
  }

  async function showNextCard(
    data: FlowCardData | undefined,
    { animation = true }: { animation?: boolean } = {},
  ) {
    const token = ++showToken

    isAnimated.value = false
    isTouchable.value = false
    flowCardRef.value?.reset()
    options.onReset()
    cardState.value = 'initial'
    cardData.value = data

    await nextTick()
    if (token !== showToken) return
    await nextPaint()
    if (token !== showToken) return

    isAnimated.value = animation
    cardState.value = 'pending'

    if (data) isTouchable.value = true
  }

  return {
    flowCardRef,
    cardData,
    cardState,
    isAnimated,
    isTouchable,
    answer,
    showNextCard,
  }
}
