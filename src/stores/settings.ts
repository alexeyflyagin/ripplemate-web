import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  SettingsRead,
  SettingsUpdate,
} from '@/api/types'
import {
  getSettings as getSettingsApi,
  updateSettings as updateSettingApi,
} from '@/api/repositories/account'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const settings = ref<SettingsRead>()

    async function getSettings() {
      settings.value = await getSettingsApi()
    }

    async function updateSettings(data: SettingsUpdate) {
      settings.value = await updateSettingApi(data)
    }

    return { settings, getSettings, updateSettings }
  },
)
