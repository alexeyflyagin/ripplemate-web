<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from './stores/settings'
import { useContextMenuStore } from './stores/contextMenu'
import ContextMenu from './components/ContextMenu/ContextMenu.vue'

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
