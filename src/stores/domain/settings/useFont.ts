import type { Font } from '@/api/types'
import { watch, type Ref } from 'vue'

export function useFont(font: Ref<Font>) {
  watch(
    font,
    (val) => {
      document.documentElement.style.setProperty(
        '--font-current',
        val === 'serif'
          ? 'var(--font-serif)'
          : 'var(--font-sans)',
      )
    },
    { immediate: true },
  )
}
