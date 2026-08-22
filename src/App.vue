<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/domain/auth'
import { useSettingsStore } from './stores/domain/settings.ts'
import { useContextMenuStore } from './stores/ui/contextMenu.ts'
import { ContextMenu } from './components/ui/ContextMenu'

const contextMenuStore = useContextMenuStore()
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

  <ContextMenu
    v-model:is-opened="contextMenuStore.isOpened"
    :x="contextMenuStore.x"
    :y="contextMenuStore.y"
    :anchor="contextMenuStore.anchor"
    :items="contextMenuStore.items"
    :payload="contextMenuStore.payload"
    @click-item="contextMenuStore.handleClick"
  />
</template>
