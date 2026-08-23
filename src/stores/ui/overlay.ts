import { defineStore } from 'pinia'
import { markRaw, readonly, ref, type Component } from 'vue'

interface Overlay {
  id: string
  component: Component
  props?: Record<string, unknown>
}

export const useOverlayStore = defineStore(
  'overlay',
  () => {
    const overlays = ref<Overlay[]>([])

    function open(
      component: Component,
      props?: Record<string, unknown>,
    ) {
      const id = `${Date.now()}-${Math.random()}`

      overlays.value.push({
        id,
        component: markRaw(component),
        props,
      })

      return id
    }

    function close(id: string) {
      const index = overlays.value.findIndex(
        (overlay) => overlay.id === id,
      )

      if (index !== -1) {
        overlays.value.splice(index, 1)
      }
    }

    return { overlays: readonly(overlays), open, close }
  },
)
