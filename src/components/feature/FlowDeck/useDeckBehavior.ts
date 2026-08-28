import { computed, readonly, ref, watch } from 'vue'
import type { AnswerType } from './FlowDeck.types'

export const SWIPE_COMMIT_THRESHOLD = 60
export const MIN_DRAG_DISTANCE = 10
const WHEEL_SWIPE_THRESHOLD = 40
const WHEEL_RESET_DELAY = 150

export function useDeckBehavior(
  answer: (type: AnswerType) => void,
) {
  let startY = 0

  const isDragging = ref<boolean>(false)
  const cardOffset = ref<number>(0)
  const isPreCommit = ref<boolean>(false)
  const progress = computed<number>(() => {
    return isPreCommit.value
      ? 1
      : Math.min(
          Math.abs(cardOffset.value) /
            SWIPE_COMMIT_THRESHOLD,
          1,
        )
  })

  watch(isPreCommit, (v) => {
    if (v) navigator.vibrate?.(1)
  })

  function onPointerDown(e: PointerEvent) {
    if (
      (e.target as HTMLElement).closest(
        '.answer-button, button, a',
      )
    ) {
      return
    }

    const el = e.currentTarget as HTMLElement
    startY = e.clientY

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp, {
      once: true,
    })
    el.addEventListener('pointercancel', onPointerCancel, {
      once: true,
    })
  }

  function onPointerMove(e: PointerEvent) {
    const offset = e.clientY - startY
    if (
      !isDragging.value &&
      Math.abs(offset) < MIN_DRAG_DISTANCE
    ) {
      return
    }
    if (!isDragging.value) {
      isDragging.value = true
      const el = e.currentTarget as HTMLElement
      el.setPointerCapture(e.pointerId)
    }
    cardOffset.value = Math.min(offset, 0)
    isPreCommit.value = -offset >= SWIPE_COMMIT_THRESHOLD
  }

  function onPointerUp(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement
    el.releasePointerCapture?.(e.pointerId)
    isDragging.value = false

    if (isPreCommit.value) {
      answer('again')
    } else {
      cardOffset.value = 0
    }

    cleanup(el)
  }

  function onPointerCancel(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement
    el.releasePointerCapture?.(e.pointerId)
    reset()
    cleanup(el)
  }

  function cleanup(el: HTMLElement) {
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerCancel)
  }

  let wheelAccum = 0
  let wheelResetTimer: ReturnType<typeof setTimeout> | undefined
  let wheelFired = false

  function onWheel(e: WheelEvent) {
    if (
      (e.target as HTMLElement).closest(
        '.answer-button, button, a',
      )
    ) {
      return
    }

    clearTimeout(wheelResetTimer)
    wheelResetTimer = setTimeout(() => {
      wheelAccum = 0
      wheelFired = false
    }, WHEEL_RESET_DELAY)

    if (wheelFired) return

    wheelAccum += e.deltaY
    if (wheelAccum >= WHEEL_SWIPE_THRESHOLD) {
      wheelFired = true
      wheelAccum = 0
      answer('again')
    }
  }

  function reset() {
    clearTimeout(wheelResetTimer)
    wheelAccum = 0
    wheelFired = false
    cardOffset.value = 0
    isPreCommit.value = false
    isDragging.value = false
  }

  return {
    cardOffset: readonly(cardOffset),
    progress: readonly(progress),
    isDragging: readonly(isDragging),
    reset,
    onPointerDown,
    onWheel,
  }
}
