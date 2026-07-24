<script setup lang="ts">
import FAB from '@/components/NavBar/FAB.vue'
import type { NavItemData } from '@/components/NavBar/NavBar.types'
import NavBar from '@/components/NavBar/NavBar.vue'
import { computed, ref } from 'vue'
import HomeIcon from '~icons/icons-16/home'
import HomeFilledIcon from '~icons/icons-16/home-filled'
import PlayIcon from '~icons/icons-16/play'
import PlayFilledIcon from '~icons/icons-16/play-filled'
import SearchIcon from '~icons/icons-16/search'
import HomeView from '../HomeView/HomeView.vue'
import FlowView from '../FlowView/FlowView.vue'

const items = ref<NavItemData[]>([
  {
    id: 'home',
    icon: HomeIcon,
    iconSelected: HomeFilledIcon,
  },
  {
    id: 'flow',
    icon: PlayIcon,
    iconSelected: PlayFilledIcon,
  },
])

const selectedIndex = ref<number>()
const selectedNavItemId = computed(() => {
  return items.value[selectedIndex.value ?? 0]?.id ?? 'home'
})
</script>

<template>
  <HomeView v-if="selectedNavItemId === 'home'" />
  <FlowView v-if="selectedNavItemId === 'flow'" />
  <div class="bottom-container">
    <NavBar
      class="nav-bar"
      :nav-items="items"
      v-model:selected-index="selectedIndex"
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
