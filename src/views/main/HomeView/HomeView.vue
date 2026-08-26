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

const emit = defineEmits<{
  editCard: [cardId: number]
}>()

const cardStore = useCardStore()
const { currentWorkspaceId } = useCurrentWorkspace()
const { currentCategoryId } = useCurrentCategory()

const { openCardMenu } = useCardItemMenu(t, {
  editCard: (cardId) => emit('editCard', cardId),
})

watch(
  () => [
    currentWorkspaceId.value,
    currentCategoryId.value,
    cardStore.search,
  ],
  ([wsId, catId]) => {
    if (wsId) {
      cardStore.loadCards(wsId as number, (catId as number) ?? null)
    } else {
      cardStore.cards = []
      cardStore.total = 0
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
      :cards="cardStore.cards"
      @load-more="loadMore"
      @contextmenu="openCardMenu"
      @click="openCardMenu"
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
  @include fade-mask(to bottom);
  --fade-start: calc(
    var(--main-header-height, 100px) + 80px
  );
  --fade-end: var(--bottom-container-height, 100px);
  --bottom-spacer: var(--bottom-container-height);
  --top-spacer: calc(
    var(--main-header-height, 200px) + 50px
  );
  flex: 1;
}
</style>
