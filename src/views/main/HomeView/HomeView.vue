<script setup lang="ts"></script>

<template>
  <div class="home-view"></div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.home-view {
  position: relative;
  display: flex;
  flex-direction: column;
}

.card-list {
  @include fade-mask(to bottom);
  --fade-start: var(--space-64);
  --fade-end: var(--bottom-container-height, 100px);
  padding: 80px 0 var(--bottom-container-height, 100px);
  flex: 1;
  min-height: 0;
}
</style>
