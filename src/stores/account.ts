import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  AccountRead,
  SettingsRead,
  SettingsUpdate,
} from '@/api/types'
import {
  getAccount as getAccountApi,
  getSettings as getSettingsApi,
  updateSettings as updateSettingApi,
} from '@/api/repositories/account'

export const useAccountStore = defineStore(
  'account',
  () => {
    const account = ref<AccountRead>()
    const settings = ref<SettingsRead>()

    async function getAccountData() {
      const [accountData, settingsData] = await Promise.all(
        [getAccountApi(), getSettingsApi()],
      )
      account.value = accountData
      settings.value = settingsData
    }

    async function updateSettings(data: SettingsUpdate) {
      settings.value = await updateSettingApi(data)
    }

    return {
      account,
      settings,
      getAccountData,
      updateSettings,
    }
  },
)
