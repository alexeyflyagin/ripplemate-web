<script setup lang="ts">
defineProps<{
  version: string
}>()
</script>

<template>
  <div class="app-version-badge">{{ version }}</div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.app-version-badge {
  @include text-label-emphasized;
  color: var(--error);
  background-color: var(--error-10);
  border-radius: var(--corner-medium);
  padding: var(--space-4) var(--space-8);
}
</style>
