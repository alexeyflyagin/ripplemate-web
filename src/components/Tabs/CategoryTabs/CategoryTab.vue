<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="category-tab"
    :class="{ 'category-tab--active': active }"
    @click="emit('click')"
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
  color: var(--accent);
  font-weight: 600;
}
</style>
