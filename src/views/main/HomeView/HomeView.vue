<script setup lang="ts">
import CardList from '@/components/CardList/CardList.vue'
import { useCardStore } from '@/stores/card'
import { useCategoryStore } from '@/stores/category'
import { useCardItemMenu } from './useCardItemMenu'
import { useI18n } from 'vue-i18n'
import NoCardsFoundIcon from '~icons/icons-80/no-cards-found'
import NoCardsYetIcon from '~icons/icons-80/no-cards-yet'
import { useWorkspaceStore } from '@/stores/workspace'

const { t } = useI18n()

const cardStore = useCardStore()
const workspaceStore = useWorkspaceStore()
const categoryStore = useCategoryStore()

const { openCardMenu } = useCardItemMenu(t)
</script>

<template>
  <div class="home-view">
    <CardList
      v-if="cardStore.cards.length"
      class="card-list"
      :list-key="`${workspaceStore.currentWorkspaceId}-${categoryStore.currentCategoryId}`"
      :has-more="cardStore.hasMore"
      :cards="cardStore.cards"
      @load-more="cardStore.loadMore"
      @contextmenu="openCardMenu"
      @click="openCardMenu"
    />
    <div v-else class="placeholder">
      <div class="placeholder__content">
        <component
          class="placeholder__icon"
          :is="
            cardStore.search
              ? NoCardsFoundIcon
              : NoCardsYetIcon
          "
        />
        <h3 class="placeholder__title">
          {{
            cardStore.search
              ? t('main.noCardsFoundTitle')
              : t('main.noCardsYetTitle')
          }}
        </h3>
        <h6 class="placeholder__subtitle">
          {{
            cardStore.search
              ? t('main.noCardsFoundSubtitle')
              : t('main.noCardsYetSubtitle')
          }}
        </h6>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/text-styles' as *;

.home-view {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.card-list {
  @include fade-mask(to bottom);
  --fade-start: var(--space-64);
  --fade-end: var(--bottom-container-height, 100px);
  flex: 1;
}

.placeholder {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--bottom-container-height);

  &__content {
    width: 280px;
    flex-direction: column;
    box-sizing: border-box;
    padding: var(--space-24);
    color: var(--text-placeholder);
    text-align: center;
  }

  &__icon {
    width: 80px;
    height: 80px;
  }

  &__title {
    @include text-title;
    margin-top: var(--space-12);
  }

  &__subtitle {
    @include text-caption;
    margin-top: var(--space-8);
  }
}
</style>
