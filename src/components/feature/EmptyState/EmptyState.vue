<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__content">
      <component class="empty-state__icon" :is="icon" />
      <h3 class="empty-state__title">
        {{ title }}
      </h3>
      <h6 class="empty-state__subtitle">
        {{ subtitle }}
      </h6>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  &__content {
    display: flex;
    width: 210px;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: var(--space-24);
    background-color: var(--surface-highest-60);
    border-radius: var(--corner-xxlarge);
    border: var(--stroke-subtle) solid var(--border-muted);
    color: var(--text-placeholder);
    text-align: center;
  }

  &__icon {
    width: 60px;
    height: 60px;
  }

  &__title {
    @include text-title;
    margin-top: var(--space-12);
  }

  &__subtitle {
    @include text-caption;
    margin-top: var(--space-8);
  }
}
</style>
