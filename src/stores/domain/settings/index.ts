import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  FONTS,
  LOCALES,
  THEMES,
  type Font,
  type Locale,
  type SettingsRead,
  type SettingsUpdate,
  type Theme,
} from '@/api/types'
import {
  getSettings as getSettingsApi,
  updateSettings as updateSettingApi,
} from '@/api/repositories/account'
import { useTheme } from '@/stores/domain/settings/useTheme'
import { getNextInArray } from '@/utils/getNextInArray'
import { useFont } from './useFont'
import { useLocale } from './useLocale'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const settings = ref<SettingsRead>({
      font: 'serif',
      language: 'auto',
      theme: 'auto',
    })

    const { isDark } = useTheme(
      computed<Theme>(() => settings.value.theme),
    )

    useFont(computed<Font>(() => settings.value.font))

    useLocale(
      computed<Locale>(() => settings.value.language),
    )

    async function loadSettings() {
      settings.value = await getSettingsApi()
    }

    async function updateSettings(data: SettingsUpdate) {
      settings.value = await updateSettingApi(data)
    }

    async function nextTheme() {
      await updateSettings({
        theme: getNextInArray(THEMES, settings.value.theme),
      })
    }

    async function nextLanguage() {
      await updateSettings({
        language: getNextInArray(
          LOCALES,
          settings.value.language,
        ),
      })
    }

    async function nextFont() {
      await updateSettings({
        font: getNextInArray(FONTS, settings.value.font),
      })
    }

    return {
      settings,
      isDark,
      updateSettings,
      nextTheme,
      nextLanguage,
      nextFont,
      loadSettings,
    }
  },
)
