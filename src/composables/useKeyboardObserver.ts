import { ref, onMounted, onUnmounted, readonly } from 'vue'

const EDITABLE_SELECTOR =
  'input, textarea, [contenteditable]:not([contenteditable="false"])'

export function useKeyboardObserver() {
  const isKeyboardOpen = ref(false)

  const isTouch = () =>
    window.matchMedia('(pointer: coarse)').matches

  const isEditable = (
    el: EventTarget | null,
  ): el is HTMLElement =>
    el instanceof HTMLElement &&
    el.matches(EDITABLE_SELECTOR)

  function onFocusIn(e: FocusEvent) {
    if (!isTouch()) return
    if (isEditable(e.target)) {
      isKeyboardOpen.value = true
    }
  }

  function onFocusOut(e: FocusEvent) {
    if (!isEditable(e.target)) return
    if (isEditable(e.relatedTarget)) return
    isKeyboardOpen.value = false
  }

  onMounted(() => {
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
  })

  onUnmounted(() => {
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
  })

  return {
    isKeyboardOpen: readonly(isKeyboardOpen),
  }
}
