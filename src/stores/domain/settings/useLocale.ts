import { computed, watch, type Ref } from 'vue'
import { usePreferredLanguages } from '@vueuse/core'
import i18n from '@/i18n'
import type { Locale } from '@/api/types'

type NonAutoLocale = Exclude<Locale, 'auto'>

export function useLocale(locale: Ref<Locale>) {
  const preferred = usePreferredLanguages()

  const effectiveLocale = computed<NonAutoLocale>(() => {
    if (locale.value === 'auto') {
      return (preferred.value[0]?.split('-')[0] ||
        'en') as NonAutoLocale
    }
    return locale.value
  })

  watch(
    effectiveLocale,
    (val) => {
      i18n.global.locale.value = val
    },
    { immediate: true },
  )
}
