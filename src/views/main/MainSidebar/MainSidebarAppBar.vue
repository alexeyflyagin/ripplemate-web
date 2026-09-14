<script setup lang="ts">
import AppVersionBadge from '@/components/ui/Badges/AppVersionBadge/AppVersionBadge.vue'
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
import { useI18n } from 'vue-i18n'
import RefreshIcon from '~icons/icons-16/refresh'

const { t } = useI18n()
</script>

<template>
  <header class="main-sidebar-app-bar">
    <div class="main-sidebar-app-bar__content">
      <h2 class="main-sidebar-app-bar__app-name">
        {{ t('appName') }}
      </h2>
      <AppVersionBadge
        class="app-version-badge"
        version="alpha"
      />
    </div>
    <BaseIconButton :icon="RefreshIcon" />
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.main-sidebar-app-bar {
  display: flex;
  padding: calc(var(--space-12) + env(safe-area-inset-top))
    var(--space-12) var(--space-8) var(--space-16);

  &__content {
    display: flex;
    flex-grow: 1;
    align-items: center;
    height: 40px;
    padding: 0 var(--space-8);
  }

  &__app-name {
    font-family: var(--font-serif);
    font-size: 20px;
    letter-spacing: 0.4px;
    font-weight: 700;
    color: var(--text);
  }
}

.app-version-badge {
  margin-left: var(--space-8);
}
</style>
