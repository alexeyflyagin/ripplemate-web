import { useEventListener } from '@vueuse/core'

export function useViewportHeight() {
  function setAppHeight() {
    const height =
      window.visualViewport?.height ?? window.innerHeight
    document.documentElement.style.setProperty(
      '--app-vh',
      `${height}px`,
    )
  }

  setAppHeight()

  useEventListener(
    window,
    'orientationchange',
    setAppHeight,
  )
  useEventListener(window, 'resize', setAppHeight)
  useEventListener(
    window.visualViewport,
    'resize',
    setAppHeight,
  )
}
