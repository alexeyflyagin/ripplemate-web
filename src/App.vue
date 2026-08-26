<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/domain/auth'
import { useOverlayStore } from './stores/ui/overlay.ts'
import { useSettingsStore } from './stores/domain/settings/index.ts'

const overlayStore = useOverlayStore()
const authStore = useAuthStore()
useSettingsStore()

onMounted(async () => {
  if (authStore.isAuthorized) {
    await authStore.initializeUserData()
  }
})
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
