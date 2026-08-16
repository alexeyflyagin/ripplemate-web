<script setup lang="ts">
import FAB from '@/components/NavBar/FAB.vue'
import type { NavItemData } from '@/components/NavBar/NavBar.types'
import NavBar from '@/components/NavBar/NavBar.vue'
import PlusIcon from '~icons/icons-16/plus'

const selectedIndex = defineModel('selectedIndex', {
  default: 0,
})

defineProps<{
  nabBarItems: NavItemData[]
}>()

const emit = defineEmits<{
  onAddClick: []
}>()
</script>

<template>
  <div class="nav-bar-group">
    <NavBar
      class="nav-bar"
      :nav-items="nabBarItems"
      v-model:selected-index="selectedIndex"
    />
    <FAB :icon="PlusIcon" @click="emit('onAddClick')" />
  </div>
</template>

<style lang="scss" scoped>
.nav-bar-group {
  display: flex;
  gap: var(--space-8);
  justify-content: center;
}
</style>
