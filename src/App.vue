<script setup lang="ts">
import { useOverlayStore } from './stores/ui/overlay.ts'
import { useSettingsStore } from './stores/domain/settings/index.ts'
import { useDataRefreshStore } from './stores/ui/dataRefresh.ts'

const overlayStore = useOverlayStore()
useSettingsStore()
useDataRefreshStore()
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
    }"
  />
</template>
