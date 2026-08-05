<script setup lang="ts">
import CardList from '@/components/CardList/CardList.vue'
import { useCardStore } from '@/stores/card'
import { useCategoryStore } from '@/stores/category'
import { useCardItemMenu } from './useCardItemMenu'
import { useI18n } from 'vue-i18n'
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
      class="card-list"
      :list-key="`${workspaceStore.currentWorkspaceId}-${categoryStore.currentCategoryId}`"
      :has-more="cardStore.hasMore"
      :cards="cardStore.cards"
      @load-more="cardStore.loadMore"
      @contextmenu="openCardMenu"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

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
</style>
