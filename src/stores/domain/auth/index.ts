import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  login as loginApi,
  register as registerApi,
} from '@/api/repositories/auth'
import type { UserCreate } from '@/api/types'
import { isJWTTokenExpired } from './utils'
import { useAccountStore } from '../account'
import { useSettingsStore } from '../settings'
import { useWorkspaceStore } from '../workspace'

const TOKEN_STORAGE_KEY = 'token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | undefined>(
    localStorage.getItem(TOKEN_STORAGE_KEY) ?? undefined,
  )

  const isAuthorized = computed(
    () => !isJWTTokenExpired(token.value),
  )

  let initPromise: Promise<void> | null = null

  watch(token, (newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  })

  async function login(email: string, password: string) {
    const response = await loginApi(email, password)
    token.value = response.access_token
    await initializeUserData()
  }

  async function registerAndLogin(data: UserCreate) {
    await registerApi(data)
    await login(data.email, data.password)
  }

  function initializeUserData() {
    if (initPromise) return initPromise

    const accountStore = useAccountStore()
    const settingsStore = useSettingsStore()
    const workspaceStore = useWorkspaceStore()

    initPromise = Promise.all([
      accountStore.getAccount(),
      settingsStore.loadSettings(),
      workspaceStore.getWorkspaces(),
    ]).then(() => undefined)

    return initPromise
  }

  function logout() {
    token.value = undefined
    window.location.assign(import.meta.env.BASE_URL)
  }

  return {
    token,
    isAuthorized,
    initializeUserData,
    login,
    register: registerAndLogin,
    logout,
  }
})
