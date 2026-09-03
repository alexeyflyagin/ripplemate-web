import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
  type FloatingElement,
  type OffsetOptions,
  type Placement,
  type ReferenceElement,
} from '@floating-ui/dom'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const PADDING = 8

export function useContextMenuPosition(
  targetEl: ReferenceElement,
  menuEl: Ref<FloatingElement | undefined>,
  options?: {
    after?: (x: number, y: number) => void
    offsetOptions?: OffsetOptions
    placement?: Placement
  },
) {
  let cleanup: (() => void) | undefined

  const xPos = ref<number>(0)
  const yPos = ref<number>(0)
  const maxHeight = ref<number | undefined>()

  onMounted(() => {
    cleanup = autoUpdate(
      targetEl,
      menuEl.value!,
      async () => {
        const { x, y } = await computePosition(
          targetEl,
          menuEl.value!,
          {
            placement: options?.placement,
            middleware: [
              offset(options?.offsetOptions),
              flip(),
              shift({ padding: PADDING }),
              size({
                padding: PADDING,
                apply({ availableHeight }) {
                  maxHeight.value = availableHeight
                },
              }),
            ],
          },
        )

        xPos.value = x
        yPos.value = y

        options?.after?.(x, y)
      },
    )
  })

  onUnmounted(() => {
    cleanup?.()
  })

  return { x: xPos, y: yPos, maxHeight }
}
