<script setup lang="ts">
import type { DeckState } from '@/components/FlowDeck/FlowDeck.types'
import FlowDeck from '@/components/FlowDeck/FlowDeck.vue'
import { useCardFlowStore } from '@/stores/cardFlow'
import { useCategoryStore } from '@/stores/category'
import { useWorkspaceStore } from '@/stores/workspace'
import { onMounted, ref, watch } from 'vue'

const workspaceStore = useWorkspaceStore()
const categoryStore = useCategoryStore()
const cardFlowStore = useCardFlowStore()

const cardFlowRef = ref<InstanceType<typeof FlowDeck>>()

const deckState = ref<DeckState>('card')
let requestId = 0

watch(
  [
    () => workspaceStore.currentWorkspaceId,
    () => categoryStore.currentCategoryId,
  ],
  async () => {
    await nextCard(true)
  },
)

async function nextCard(first: boolean = false) {
  deckState.value = 'card'
  cardFlowRef.value?.showNextCard(undefined)

  const currentId = ++requestId
  const card = await cardFlowStore.getNextCard()
  if (currentId !== requestId) return

  if (!card) deckState.value = 'empty'
  else deckState.value = 'card'

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

onMounted(async () => {
  await nextCard(true)
})
</script>

<template>
  <div class="flow-view">
    <FlowDeck
      class="flow-deck"
      ref="cardFlowRef"
      :state="deckState"
      @nextcard="nextCard"
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
