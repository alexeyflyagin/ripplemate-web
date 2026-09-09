import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  login as loginApi,
  register as registerApi,
} from '@/api/repositories/auth'
import { exists as existsApi } from '@/api/repositories/account'
import {
  requestResetPassword as requestResetPasswordApi,
  resetPassword as resetPasswordApi,
  verifyResetCode as verifyResetCodeApi,
} from '@/api/repositories/verification'
import type {
  AccountExists,
  ResetPassword,
  ResetPasswordRequest,
  UserCreate,
  VerifyResetCode,
} from '@/api/types'
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

  function exists(email: string): Promise<AccountExists> {
    return existsApi(email)
  }

  async function login(email: string, password: string) {
    const response = await loginApi(email, password)
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      response.access_token,
    )
    token.value = response.access_token
    await initializeUserData()
  }

  async function registerAndLogin(data: UserCreate) {
    await registerApi(data)
    await login(data.email, data.password)
  }

  async function initializeUserData() {
    if (initPromise) return initPromise

    const accountStore = useAccountStore()
    const settingsStore = useSettingsStore()
    const workspaceStore = useWorkspaceStore()

    await accountStore.getAccount()
    if (accountStore.account?.is_verified) {
      initPromise = Promise.all([
        settingsStore.loadSettings(),
        workspaceStore.getWorkspaces(),
      ]).then(() => undefined)
    }

    return initPromise
  }

  function logout() {
    token.value = undefined
    window.location.assign(import.meta.env.BASE_URL)
  }

  function requestResetPassword(
    data: ResetPasswordRequest,
  ) {
    return requestResetPasswordApi(data)
  }

  function verifyResetCode(data: VerifyResetCode) {
    return verifyResetCodeApi(data)
  }

  function resetPassword(data: ResetPassword) {
    return resetPasswordApi(data)
  }

  return {
    token,
    isAuthorized,
    exists,
    initializeUserData,
    login,
    register: registerAndLogin,
    logout,
    requestResetPassword,
    resetPassword,
    verifyResetCode,
  }
})
