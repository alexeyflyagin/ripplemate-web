<script setup lang="ts">
import { CardList } from '@/components/feature/CardList'
import { useCardStore } from '@/stores/domain/card'
import { useCardItemMenu } from './useCardItemMenu'
import { useI18n } from 'vue-i18n'
import NoCardsFoundIcon from '~icons/icons-80/no-cards-found'
import NoCardsYetIcon from '~icons/icons-80/no-cards-yet'
import { EmptyState } from '@/components/feature/EmptyState'
import { CircularProgressBar } from '@/components/ui/ProgressBar/CircularProgressBar'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { useFavoritesFilter } from '@/stores/domain/card/useFavoritesFilter'
import { computed, ref, watch } from 'vue'

const { t } = useI18n()

defineProps<{
  headerHeight?: number
}>()

const emit = defineEmits<{
  editCard: [cardId: string]
  contentScrolled: [scrolled: boolean]
}>()

const cardStore = useCardStore()
const { currentWorkspaceId } = useCurrentWorkspace()
const { currentCategoryId } = useCurrentCategory()
const { favoritesOnly } = useFavoritesFilter()

const { selectedCardId, openCardMenu } = useCardItemMenu(
  t,
  {
    editCard: (cardId) => emit('editCard', cardId),
  },
)
const highlitedCardIds = computed<Set<string>>(() => {
  if (!selectedCardId.value) return new Set()
  return new Set([selectedCardId.value])
})

const displayedCards = computed(() => {
  if (!favoritesOnly.value) return cardStore.cards
  return cardStore.cards.filter((c) => c.is_favorite)
})

const isCardListScrolled = ref(false)
const isContentUnderHeader = computed(
  () =>
    displayedCards.value.length > 0 &&
    isCardListScrolled.value,
)

watch(isContentUnderHeader, (v) => emit('contentScrolled', v), {
  immediate: true,
})

function onToggleFavorite(cardId: string) {
  if (!currentWorkspaceId.value) return
  cardStore.toggleFavorite(currentWorkspaceId.value, cardId)
}

watch(
  () => [
    currentWorkspaceId.value,
    currentCategoryId.value,
    cardStore.search,
  ],
  () => {
    const wsId = currentWorkspaceId.value
    if (wsId) {
      cardStore.loadCards(
        wsId,
        currentCategoryId.value ?? null,
      )
    } else {
      cardStore.clearWorkspaceCache()
    }
  },
  { immediate: true },
)

function loadMore() {
  if (!currentWorkspaceId.value) return
  cardStore.loadMore(
    currentWorkspaceId.value,
    currentCategoryId.value ?? null,
  )
}
</script>

<template>
  <div class="home-view">
    <CardList
      v-if="displayedCards.length"
      class="card-list"
      :list-key="`${currentWorkspaceId}-${currentCategoryId}-${favoritesOnly}`"
      :has-more="cardStore.hasMore"
      :header-height="headerHeight"
      :cards="displayedCards"
      :new-ids="cardStore.justCreatedIds"
      :leaving-ids="cardStore.deletingIds"
      :highlited-ids="highlitedCardIds"
      @load-more="loadMore"
      @contextmenu="openCardMenu"
      @click="openCardMenu"
      @card-seen="cardStore.markCardSeen"
      @card-leave-done="cardStore.onCardLeaveDone"
      @toggle-favorite="onToggleFavorite"
      @scrolled-changed="(v) => (isCardListScrolled = v)"
    />
    <CircularProgressBar
      v-else-if="cardStore.isLoading"
      class="circle-progress"
      :delay="1000"
    />
    <EmptyState
      v-else
      class="empty-state"
      :icon="
        cardStore.search || favoritesOnly
          ? NoCardsFoundIcon
          : NoCardsYetIcon
      "
      :title="
        cardStore.search || favoritesOnly
          ? t('main.noCardsFoundTitle')
          : t('main.noCardsYetTitle')
      "
      :subtitle="
        cardStore.search || favoritesOnly
          ? t('main.noCardsFoundSubtitle')
          : t('main.noCardsYetSubtitle')
      "
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.empty-state {
  flex: 1;
  margin-top: var(--main-header-height);
  margin-bottom: var(--bottom-navigation-height);
}

.home-view {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.circle-progress {
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: var(--main-header-height);
  margin-bottom: var(--bottom-navigation-height);
}

.card-list {
  --fade-start-color: rgba(0, 0, 0, 0.4);
  --fade-start-margin: var(--main-header-height, 100px);
  --fade-start: 30px;
  --fade-end: var(--bottom-navigation-height, 100px);
  --bottom-spacer: calc(
    var(--bottom-navigation-height) + var(--space-24)
  );
  --top-spacer: calc(
    var(--main-header-height, 200px) + 50px
  );
  flex: 1;
}
</style>
