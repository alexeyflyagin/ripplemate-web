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
} from '@/composables/useTheme'
import {
  applyLocale,
  getNextLocale,
} from '@/composables/useLocale'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const settings = ref<SettingsRead>()
    let stopWatchingSystemTheme: (() => void) | null = null

    watch(
      settings,
      (value) => {
        stopWatchingSystemTheme?.()
        stopWatchingSystemTheme = null

        const theme = value?.theme ?? 'auto'
        const language = value?.language ?? 'auto'

        applyTheme(theme)
        applyLocale(language)

        if (theme === 'auto') {
          stopWatchingSystemTheme = watchSystemTheme(() =>
            applyTheme('auto'),
          )
        }
      },
      { immediate: true },
    )

    async function getSettings() {
      settings.value = await getSettingsApi()
    }

    async function updateSettings(data: SettingsUpdate) {
      settings.value = await updateSettingApi(data)
    }

    async function nextTheme() {
      if (!settings.value)
        throw new Error('Settings were not loaded')

      await updateSettings({
        theme: getNextTheme(settings.value.theme),
      })
    }

    async function nextLanguage() {
      if (!settings.value)
        throw new Error('Settings were not loaded')

      await updateSettings({
        language: getNextLocale(settings.value.language),
      })
    }

    function resetSettings() {
      settings.value = undefined
    }

    return {
      settings,
      getSettings,
      updateSettings,
      nextTheme,
      nextLanguage,
      resetSettings,
    }
  },
)
