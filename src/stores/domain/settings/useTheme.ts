import type { Theme } from '@/api/types'
import { usePreferredDark } from '@vueuse/core'
import { computed, watch, type Ref } from 'vue'

export function useTheme(theme: Ref<Theme>) {
  const isDark = computed(() => {
    if (theme.value === 'auto')
      return usePreferredDark().value
    return theme.value === 'dark'
  })

  watch(
    isDark,
    (val) => {
      document.documentElement.setAttribute(
        'data-theme',
        val ? 'dark' : 'light',
      )
    },
    { immediate: true },
  )

  return { isDark }
}
