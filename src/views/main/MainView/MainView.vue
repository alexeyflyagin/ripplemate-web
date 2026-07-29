<script setup lang="ts">
import FAB from '@/components/NavBar/FAB.vue'

import NavBar from '@/components/NavBar/NavBar.vue'

import SearchIcon from '~icons/icons-16/search'
import HomeView from '../HomeView/HomeView.vue'
import FlowView from '../FlowView/FlowView.vue'
import { useCardStore } from '@/stores/card.ts'
import { useCategoryStore } from '@/stores/category.ts'
import { useNavBar } from './useNavBar.ts'
import MainHeader from '../MainHeader/MainHeader.vue'

const cardStore = useCardStore()
const categoryStore = useCategoryStore()

const { items, selectedIndex, selectedNavItemId } =
  useNavBar()

async function onAddClick() {
  await cardStore.createCard({
    term: `Card ${Math.round(Math.random() * 10000)}`,
    category_id: categoryStore.currentCategoryId,
  })
}
</script>

<template>
  <MainHeader />
  <HomeView v-if="selectedNavItemId === 'home'" />
  <FlowView v-if="selectedNavItemId === 'flow'" />
  <div class="bottom-container">
    <NavBar
      class="nav-bar"
      :nav-items="items"
      v-model:selected-index="selectedIndex"
      @add-click="onAddClick"
    />
    <FAB :icon="SearchIcon" />
  </div>
</template>

<style lang="scss" scoped>
.bottom-container {
  position: absolute;
  display: flex;
  right: 0;
  left: 0;
  bottom: 0;
  justify-content: center;
  gap: var(--space-8);
  padding: 0 var(--space-24) var(--space-24);
}
</style>
