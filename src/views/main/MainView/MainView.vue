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
import { onMounted, ref } from 'vue'

const cardStore = useCardStore()
const categoryStore = useCategoryStore()

let bottomContainerResizeObserver: ResizeObserver | null =
  null
const bottomContainer = ref<HTMLElement>()
const bottomContainerHeight = ref<number>(0)

const { items, selectedIndex, selectedNavItemId } =
  useNavBar()

async function onAddClick() {
  await cardStore.createCard({
    term: `Card ${Math.round(Math.random() * 10000)}`,
    category_id: categoryStore.currentCategoryId,
  })
}

onMounted(() => {
  bottomContainerResizeObserver = new ResizeObserver(() => {
    bottomContainerHeight.value =
      document
        .querySelector('.bottom-container')
        ?.getBoundingClientRect().height ?? 0
  })

  if (bottomContainer.value) {
    bottomContainerResizeObserver.observe(
      bottomContainer.value,
    )
  }
})
</script>

<template>
  <div
    class="main-view"
    :style="{
      '--bottom-container-height':
        bottomContainerHeight + 'px',
    }"
  >
    <MainHeader class="main-header" />
    <HomeView
      class="home-view"
      v-if="selectedNavItemId === 'home'"
    />
    <FlowView
      class="flow-view"
      v-if="selectedNavItemId === 'flow'"
    />
    <div class="bottom-container" ref="bottomContainer">
      <NavBar
        class="nav-bar"
        :nav-items="items"
        v-model:selected-index="selectedIndex"
        @add-click="onAddClick"
      />
      <FAB :icon="SearchIcon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-view {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-header {
  flex-shrink: 0;
  z-index: 1;
}

.home-view,
.flow-view {
  flex: 1;
  min-height: 0;
}

.bottom-container {
  position: absolute;
  display: flex;
  right: 0;
  left: 0;
  bottom: 0;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-24);
  z-index: 1;
}
</style>
