<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div>
    <div class="card-group-label__container">
      <span class="card-group-label__label">{{
        label
      }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.card-group-label__container {
  padding: var(--space-16) var(--space-4) var(--space-4);
}

.card-group-label__label {
  @include text-label;
  display: block;
  color: var(--text-placeholder);
  padding: var(--space-4) var(--space-12);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
}
</style>
