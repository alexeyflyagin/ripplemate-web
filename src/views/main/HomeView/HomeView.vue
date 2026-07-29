<script setup lang="ts">
import CardList from '@/components/CardList/CardList.vue'
import MainHeader from '../MainHeader/MainHeader.vue'
import { useI18n } from 'vue-i18n'
import { useCardItemMenu } from './useCardItemMenu.ts'
import { useCardGroups } from './useCardGroups.ts'

const { t } = useI18n()

const { openCardMenu } = useCardItemMenu(t)
const { cardGroups } = useCardGroups(t)
</script>

<template>
  <div class="content">
    <MainHeader />
    <CardList
      class="card-list"
      :groups="cardGroups"
      @contextmenu="openCardMenu"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.card-list {
  @include fade-mask(to bottom);
  --fade-start: 20px;
  --fade-end: 200px;
  flex-grow: 1;
}
</style>
