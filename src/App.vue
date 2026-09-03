<script setup lang="ts">
import { useOverlayStore } from './stores/ui/overlay.ts'
import { useSettingsStore } from './stores/domain/settings/index.ts'

const overlayStore = useOverlayStore()
useSettingsStore()
</script>

<template>
  <RouterView />

  <component
    v-for="(overlay, index) in overlayStore.overlays"
    :key="overlay.id"
    :is="overlay.component"
    v-bind="overlay.props"
    :style="{
      zIndex: 1000 + index,
      padding: `env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)`,
    }"
  />
</template>
