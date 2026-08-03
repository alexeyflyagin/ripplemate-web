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
}
</style>
