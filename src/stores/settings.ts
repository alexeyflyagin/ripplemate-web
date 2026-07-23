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
  THEMES,
  watchSystemTheme,
} from '@/composables/useTheme'
import {
  applyLocale,
  LOCALES,
} from '@/composables/useLocale'
import { getNextInArray } from '@/utils/getNextInArray'
import { applyFont, FONTS } from '@/composables/useFont'

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
        const font = value?.font ?? 'sans-serif'

        applyTheme(theme)
        applyLocale(language)
        applyFont(font)

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
        theme: getNextInArray(THEMES, settings.value.theme),
      })
    }

    async function nextLanguage() {
      if (!settings.value)
        throw new Error('Settings were not loaded')

      await updateSettings({
        language: getNextInArray(
          LOCALES,
          settings.value.language,
        ),
      })
    }

    async function nextFont() {
      if (!settings.value)
        throw new Error('Settings were not loaded')

      await updateSettings({
        font: getNextInArray(FONTS, settings.value.font),
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
      nextFont,
    }
  },
)
