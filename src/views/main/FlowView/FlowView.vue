<script setup lang="ts">
import FlowDeck from '@/components/FlowDeck/FlowDeck.vue'
import { useCardFlowStore } from '@/stores/cardFlow'
import { useCategoryStore } from '@/stores/category'
import { onMounted, ref, watch } from 'vue'

const categoryStore = useCategoryStore()
const cardFlowStore = useCardFlowStore()

const cardFlowRef = ref<InstanceType<typeof FlowDeck>>()

watch(
  () => categoryStore.currentCategory,
  async () => {
    await showFirstCard()
  },
)

async function showFirstCard() {
  {
    const card = await cardFlowStore.getNextCard()
    cardFlowRef.value?.showNextCard(
      card
        ? {
            card_id: card.id,
            term: card.term,
          }
        : undefined,
      { animation: false },
    )
  }
}

async function nextCard() {
  const card = await cardFlowStore.getNextCard()
  cardFlowRef.value?.showNextCard(
    card
      ? {
          card_id: card.id,
          term: card.term,
        }
      : undefined,
  )
}

onMounted(async () => {
  await showFirstCard()
})
</script>

<template>
  <div class="flow-view">
    <FlowDeck
      class="flow-deck"
      ref="cardFlowRef"
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
