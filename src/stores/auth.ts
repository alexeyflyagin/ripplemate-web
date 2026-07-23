import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  login as loginApi,
  register as registerApi,
} from '@/api/repositories/auth'
import type { UserCreate } from '@/api/types'
import { isJWTTokenExpired } from './utils'
import { useAccountStore } from './account'
import { useSettingsStore } from './settings'
import { useWorkspaceStore } from './workspace'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(
    localStorage.getItem('token'),
  )

  const isAuthenticated = computed(() => {
    if (token.value === null) return false
    return !isJWTTokenExpired(token.value)
  })

  async function login(email: string, password: string) {
    const response = await loginApi(email, password)
    token.value = response.access_token
    localStorage.setItem('token', response.access_token)
  }

  async function registerAndLogin(data: UserCreate) {
    await registerApi(data)
    await login(data.email, data.password)
  }

  async function initializeUserData() {
    const accountStore = useAccountStore()
    const settingsStore = useSettingsStore()
    const workspaceStore = useWorkspaceStore()

    await Promise.all([
      accountStore.getAccount(),
      settingsStore.getSettings(),
      workspaceStore.getWorkspaces(),
    ])
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    isAuthenticated,
    login,
    register: registerAndLogin,
    logout,
    initializeUserData,
  }
})
