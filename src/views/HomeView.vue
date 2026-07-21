<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/Buttons/BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div>
    <h1>Home</h1>
    <BaseButton label="log out" @click="handleLogout">
      Logout
    </BaseButton>
  </div>
</template>
