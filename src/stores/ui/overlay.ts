import { useEventListener } from '@vueuse/core'
import { defineStore } from 'pinia'
import {
  computed,
  markRaw,
  readonly,
  ref,
  type Component,
  type ComputedRef,
} from 'vue'

interface Overlay {
  id: string
  component: Component
  props?: Record<string, unknown>
}

export interface OverlayHandle {
  id: string
  isOpen: ComputedRef<boolean>
  close: () => void
}

export const useOverlayStore = defineStore(
  'overlay',
  () => {
    const overlays = ref<Overlay[]>([])

    function open(
      component: Component,
      props?: Record<string, unknown>,
    ): OverlayHandle {
      const id = `${Date.now()}-${Math.random()}`

      overlays.value.push({
        id,
        component: markRaw(component),
        props,
      })

      console.log(overlays.value)

      return {
        id,

        isOpen: computed(() =>
          overlays.value.some((o) => o.id === id),
        ),

        close: () => close(id),
      }
    }

    function close(id: string) {
      const index = overlays.value.findIndex(
        (overlay) => overlay.id === id,
      )

      if (index !== -1) {
        overlays.value.splice(index, 1)
      }
    }

    function closeTop() {
      const top = overlays.value.at(-1)
      if (!top) return
      close(top.id)
    }

    useEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlays.value.length) {
        closeTop()
      }
    })

    return {
      overlays: readonly(overlays),
      open,
      close,
      closeTop,
    }
  },
)
