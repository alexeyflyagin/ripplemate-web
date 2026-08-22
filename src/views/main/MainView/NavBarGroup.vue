<script setup lang="ts">
import {
  FAB,
  NavBar,
  type NavItemData,
} from '@/components/ui/NavBar'
import PlusIcon from '~icons/icons-16/plus'

const selectedId = defineModel<string>('selectedId', {
  required: true,
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
      v-model:selectedId="selectedId"
    />
    <FAB
      class="fab"
      :icon="PlusIcon"
      @click="emit('onAddClick')"
    />
  </div>
</template>

<style lang="scss" scoped>
.nav-bar-group {
  display: flex;
  gap: var(--space-8);
  justify-content: center;
}

.nav-bar {
  pointer-events: auto;
}

.fab {
  pointer-events: auto;
}
</style>
