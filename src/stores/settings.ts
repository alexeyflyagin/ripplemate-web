import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type {
  SettingsRead,
  SettingsUpdate,
} from '@/api/types'
import {
  getSettings as getSettingsApi,
  updateSettings as updateSettingApi,
} from '@/api/repositories/account'
import {
  applyTheme,
  getNextTheme,
  watchSystemTheme,
  type Theme,
} from '@/composables/useTheme'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const settings = ref<SettingsRead>()
    let stopWatchingSystemTheme: (() => void) | null = null

    watch(settings, (value) => {
      if (!value) return
      const theme = value.theme as Theme
      applyTheme(theme)

      stopWatchingSystemTheme?.()
      if (theme === 'auto') {
        stopWatchingSystemTheme = watchSystemTheme(() =>
          applyTheme(theme),
        )
      }
    })

    async function getSettings() {
      settings.value = await getSettingsApi()
    }

    async function updateSettings(data: SettingsUpdate) {
      settings.value = await updateSettingApi(data)
    }

    async function nextTheme() {
      if (!settings.value) return

      await updateSettings({
        theme: getNextTheme(settings.value.theme as Theme),
      })
    }

    return {
      settings,
      getSettings,
      updateSettings,
      nextTheme,
    }
  },
)
