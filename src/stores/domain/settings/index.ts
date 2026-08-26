import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
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

const THEME_KEY = 'settings.theme'
const FONT_KEY = 'settings.font'
const LOCALE_KEY = 'settings.language'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const settings = ref<SettingsRead>({})

    const theme = useStorage<Theme>(THEME_KEY, 'auto')
    const font = useStorage<Font>(FONT_KEY, 'serif')
    const language = useStorage<Locale>(LOCALE_KEY, 'auto')

    const { isDark } = useTheme(theme)
    useFont(font)
    useLocale(language)

    async function loadSettings() {
      settings.value = await getSettingsApi()
    }

    async function updateSettings(data: SettingsUpdate) {
      settings.value = await updateSettingApi(data)
    }

    function nextTheme() {
      theme.value = getNextInArray(THEMES, theme.value)
    }

    function nextLanguage() {
      language.value = getNextInArray(
        LOCALES,
        language.value,
      )
    }

    function nextFont() {
      font.value = getNextInArray(FONTS, font.value)
    }

    return {
      settings,
      theme,
      font,
      language,
      isDark,
      loadSettings,
      updateSettings,
      nextTheme,
      nextLanguage,
      nextFont,
    }
  },
)
