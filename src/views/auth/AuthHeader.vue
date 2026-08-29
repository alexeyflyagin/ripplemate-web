<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  subtitle?: string
  title?: string
}>()
</script>

<template>
  <div class="auth-header">
    <h1 v-if="!title" class="auth-header__app-name">
      {{ t('appName') }}
    </h1>
    <h1 v-else class="auth-header__header">{{ title }}</h1>
    <p v-if="subtitle" class="auth-header__subtitle">
      {{ subtitle }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.auth-header {
  display: flex;
  flex-direction: column;
}

.auth-header__app-name {
  @include text-heading;
  color: var(--text);
  text-align: center;
}

.auth-header__header {
  @include text-title;
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
