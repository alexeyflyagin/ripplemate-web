import type { Theme } from '@/api/types'
import { usePreferredDark } from '@vueuse/core'
import { computed, watch, type Ref } from 'vue'

type EffectiveTheme = 'light' | 'dark' | 'oled'

export function useTheme(
  theme: Ref<Theme>,
  oledEnabled: Ref<boolean>,
) {
  const preferredDark = usePreferredDark()

  const isDark = computed(() => {
    if (theme.value === 'auto') return preferredDark.value
    return theme.value === 'dark'
  })

  const effectiveTheme = computed<EffectiveTheme>(() => {
    if (!isDark.value) return 'light'
    return oledEnabled.value ? 'oled' : 'dark'
  })

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
