import type { Theme } from '@/api/types'
import { usePreferredDark } from '@vueuse/core'
import { computed, watch, type Ref } from 'vue'

type EffectiveTheme = Exclude<Theme, 'auto'>

export function useTheme(theme: Ref<Theme>) {
  const preferredDark = usePreferredDark()

  const effectiveTheme = computed<EffectiveTheme>(() => {
    if (theme.value === 'auto')
      return preferredDark.value ? 'dark' : 'light'
    return theme.value
  })

  const isDark = computed(
    () => effectiveTheme.value !== 'light',
  )

  watch(
    effectiveTheme,
    (val) => {
      document.documentElement.setAttribute(
        'data-theme',
        val,
      )
    },
    { immediate: true },
  )

  return { isDark, effectiveTheme }
}
