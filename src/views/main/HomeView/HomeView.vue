<script setup lang="ts">
import CardList from '@/components/CardList/CardList.vue'
import { useI18n } from 'vue-i18n'
import { useCardItemMenu } from './useCardItemMenu.ts'
import { useCardGroups } from './useCardGroups.ts'

const { t } = useI18n()

const { openCardMenu } = useCardItemMenu(t)
const { cardGroups } = useCardGroups(t)
</script>

<template>
  <div class="home-view">
    <CardList
      class="card-list"
      :groups="cardGroups"
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
}

.card-list {
  @include fade-mask(to bottom);
  --fade-start: var(--space-64);
  --fade-end: var(--bottom-container-height, 100px);
  padding: 80px 0 var(--bottom-container-height, 100px);
  flex: 1;
  min-height: 0;
}
</style>
