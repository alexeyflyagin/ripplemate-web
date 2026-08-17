import { ref } from 'vue'

export function useKeyboardObserver() {
  const isKeyboardOpen = ref(false)

  function onViewportResize() {
    const vv = window.visualViewport
    if (!vv) return
    isKeyboardOpen.value =
      window.innerHeight - vv.height < 0
  }

  function addKeyboardObserver() {
    window.visualViewport?.addEventListener(
      'resize',
      onViewportResize,
    )
  }

  function removeKeyboardObserver() {
    window.visualViewport?.removeEventListener(
      'resize',
      onViewportResize,
    )
  }

  return {
    isKeyboardOpen,
    addKeyboardObserver,
    removeKeyboardObserver,
  }
}
