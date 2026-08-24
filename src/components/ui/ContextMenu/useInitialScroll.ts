import { nextPaint } from '@/utils/nextPaint'
import { useResizeObserver } from '@vueuse/core'
import type { Ref } from 'vue'

export function useInitialScroll(
  elements: Ref<Map<string, HTMLElement>>,
  menuEl: Ref<HTMLElement | undefined>,
  initialScrollToId: string | undefined,
) {
  useResizeObserver(menuEl, async () => {
    await nextPaint()
    if (initialScrollToId) {
      const el = elements.value.get(initialScrollToId)
      if (el) {
        el.scrollIntoView({
          behavior: 'instant',
          block: 'center',
          inline: 'center',
        })
      }
    }
  })
}
