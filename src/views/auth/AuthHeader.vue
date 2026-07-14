<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="auth-header">
    <h1 class="auth-header__title">{{ title }}</h1>
    <p class="auth-header__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/text-styles' as *;

.auth-header {
  display: flex;
  flex-direction: column;
}

.auth-header__title {
  @include text-heading;
  color: var(--text);
  text-align: center;
}

.auth-header__subtitle {
  @include text-caption;
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-4);
}
</style>
