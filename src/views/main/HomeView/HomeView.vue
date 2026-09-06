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
import { watch } from 'vue'

const { t } = useI18n()

defineProps<{
  headerHeight?: number
}>()

const emit = defineEmits<{
  editCard: [cardId: string]
}>()

const cardStore = useCardStore()
const { currentWorkspaceId } = useCurrentWorkspace()
const { currentCategoryId } = useCurrentCategory()

const { openCardMenu } = useCardItemMenu(t, {
  editCard: (cardId) => emit('editCard', cardId),
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
      v-if="cardStore.cards.length"
      class="card-list"
      :list-key="`${currentWorkspaceId}-${currentCategoryId}-${cardStore.search}`"
      :has-more="cardStore.hasMore"
      :header-height="headerHeight"
      :cards="cardStore.cards"
      :new-ids="cardStore.justCreatedIds"
      :leaving-ids="cardStore.deletingIds"
      @load-more="loadMore"
      @contextmenu="openCardMenu"
      @click="openCardMenu"
      @card-seen="cardStore.markCardSeen"
      @card-leave-done="cardStore.onCardLeaveDone"
      @toggle-favorite="onToggleFavorite"
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
        cardStore.search ? NoCardsFoundIcon : NoCardsYetIcon
      "
      :title="
        cardStore.search
          ? t('main.noCardsFoundTitle')
          : t('main.noCardsYetTitle')
      "
      :subtitle="
        cardStore.search
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
  margin-bottom: var(--bottom-container-height);
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
  margin-bottom: var(--bottom-container-height);
}

.card-list {
  --fade-start-color: rgba(0, 0, 0, 0.4);
  --fade-start-margin: var(--main-header-height, 100px);
  --fade-start: 30px;
  --fade-end: var(--bottom-container-height, 100px);
  --bottom-spacer: var(--bottom-container-height);
  --top-spacer: calc(
    var(--main-header-height, 200px) + 50px
  );
  flex: 1;
}
</style>
