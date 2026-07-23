import i18n from '@/i18n'
import { getNextInArray } from '@/utils/getNextInArray'

export const LOCALES = ['auto', 'en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

const AVAILABLE_LOCALES = LOCALES.filter(
  (l) => l !== 'auto',
) as Exclude<Locale, 'auto'>[]
const DEFAULT_LOCALE: Exclude<Locale, 'auto'> = 'en'

function resolveLocale(
  locale: Locale,
): Exclude<Locale, 'auto'> {
  if (locale !== 'auto') return locale

  const browserLang = navigator.language.slice(0, 2)
  const matched = AVAILABLE_LOCALES.find(
    (l) => l === browserLang,
  )
  return matched ?? DEFAULT_LOCALE
}

export function applyLocale(locale: Locale) {
  i18n.global.locale.value = resolveLocale(locale)
}

export function getNextLocale(current: Locale): Locale {
  return getNextInArray(LOCALES, current)
}
