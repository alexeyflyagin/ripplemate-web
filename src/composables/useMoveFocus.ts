import { computed, type Ref } from 'vue'
import { tabbable } from 'tabbable'
import { useEventListener } from '@vueuse/core'

export function useMoveFocus(
  scopeEl: Ref<HTMLElement | undefined>,
  options?: { withArrows?: boolean },
) {
  const elements = computed(() => {
    if (!scopeEl.value) return
    return tabbable(scopeEl.value)
  })

  function moveFocus(direction: 1 | -1) {
    if (!elements.value?.length) return

    const index = elements.value.indexOf(
      document.activeElement as HTMLElement,
    )

    const nextIndex =
      (index + direction + elements.value.length) %
      elements.value.length

    elements.value[nextIndex]?.focus()
  }

  const nextFocus = () => moveFocus(1)
  const previousFocus = () => moveFocus(-1)

  if (options?.withArrows) {
    useEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        nextFocus()
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        previousFocus()
      }
    })
  }

  return { nextFocus, previousFocus }
}
