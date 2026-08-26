<script setup lang="ts">
import {
  FlowDeck,
  type DeckState,
} from '@/components/feature/FlowDeck'
import { useCardFlowStore } from '@/stores/domain/cardFlow'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { ref, watch } from 'vue'

const cardFlowStore = useCardFlowStore()
const { currentWorkspaceId } = useCurrentWorkspace()
const { currentCategoryId } = useCurrentCategory()

const cardFlowRef = ref<InstanceType<typeof FlowDeck>>()
const deckState = ref<DeckState>('card')

watch(
  () => [currentWorkspaceId.value, currentCategoryId.value],
  () => {
    loadNextCard(true)
  },
  { immediate: true },
)

async function loadNextCard(first: boolean = false) {
  deckState.value = 'card'
  cardFlowRef.value?.showNextCard(undefined)

  if (!currentWorkspaceId.value) {
    deckState.value = 'empty'
    return
  }

  await cardFlowStore.nextCard(
    currentWorkspaceId.value,
    currentCategoryId.value ?? null,
  )

  const card = cardFlowStore.currentCard
  deckState.value = card ? 'card' : 'empty'

  cardFlowRef.value?.showNextCard(
    card
      ? {
          card_id: card.id,
          term: card.term,
        }
      : undefined,
    { animation: !first },
  )
}
</script>

<template>
  <div class="flow-view">
    <FlowDeck
      class="flow-deck"
      ref="cardFlowRef"
      :state="deckState"
      @nextcard="loadNextCard"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.flow-view {
  position: relative;
  display: flex;
}

.flow-deck {
  @include fade-mask(to bottom);
  --fade-start: calc(var(--main-header-height, 100px));
  --fade-end: var(--bottom-container-height, 100px);
  position: relative;
  flex: 1;
}
</style>
