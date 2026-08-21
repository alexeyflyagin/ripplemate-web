<script setup lang="ts">
import CardList from '@/components/CardList/CardList.vue'
import { useCardStore } from '@/stores/card'
import { useCategoryStore } from '@/stores/category'
import { useCardItemMenu } from './useCardItemMenu'
import { useI18n } from 'vue-i18n'
import NoCardsFoundIcon from '~icons/icons-80/no-cards-found'
import NoCardsYetIcon from '~icons/icons-80/no-cards-yet'
import { useWorkspaceStore } from '@/stores/workspace'
import EmptyState from '../../../components/EmptyState.vue'

const { t } = useI18n()

const cardStore = useCardStore()
const categoryStore = useCategoryStore()
const workspaceStore = useWorkspaceStore()

const { openCardMenu } = useCardItemMenu(t)
</script>

<template>
  <div class="home-view">
    <CardList
      v-if="cardStore.cards.length"
      class="card-list"
      :list-key="`${workspaceStore.currentWorkspaceId}-${categoryStore.currentCategoryId}-${cardStore.search}`"
      :has-more="cardStore.hasMore"
      :cards="cardStore.cards"
      @load-more="cardStore.loadMore"
      @contextmenu="openCardMenu"
      @click="openCardMenu"
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
