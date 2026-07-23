<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from './stores/settings'

const authStore = useAuthStore()
useSettingsStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await authStore.initializeUserData()
  }
})
</script>

<template>
  <RouterView />
</template>
