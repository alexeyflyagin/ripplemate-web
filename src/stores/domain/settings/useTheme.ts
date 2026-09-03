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

  const themeColorMeta = document.querySelector(
    'meta[name="theme-color"]',
  )

  watch(
    effectiveTheme,
    (val) => {
      document.documentElement.setAttribute(
        'data-theme',
        val,
      )
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg')
        .trim()
      themeColorMeta?.setAttribute('content', bg)
    },
    { immediate: true },
  )

  return { isDark, effectiveTheme }
}
