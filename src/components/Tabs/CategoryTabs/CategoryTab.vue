<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
  pointerdown: [event: MouseEvent]
  pointerup: [event: MouseEvent]
}>()
</script>

<template>
  <button
    type="button"
    class="category-tab"
    :class="{ 'category-tab--active': active }"
    @pointerdown="emit('pointerdown', $event)"
    @pointerup="emit('pointerup', $event)"
    @click="emit('click', $event)"
    @contextmenu.prevent="emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.category-tab {
  @include text-label;
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  background-color: transparent;
  border: none;
  border-radius: var(--corner-large);
  padding: var(--space-12) var(--space-16);
  color: var(--text-muted);
  cursor: pointer;
  z-index: 1;
}

.category-tab--active {
  color: var(--text);
  font-weight: 600;
}
</style>
