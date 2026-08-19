import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useBottomContainer(
  bottomContainerEl: Ref<HTMLElement | undefined>,
) {
  const bottomContainerHeight = ref<number>(0)

  const bottomContainerRO: ResizeObserver =
    new ResizeObserver(() => {
      bottomContainerHeight.value =
        document
          .querySelector('.bottom-container')
          ?.getBoundingClientRect().height ?? 0
    })

  function observeBottomContainerHeight() {
    if (bottomContainerEl.value) {
      bottomContainerRO.observe(bottomContainerEl.value)
    }
  }

  onMounted(() => {
    observeBottomContainerHeight()
  })

  onUnmounted(() => {
    bottomContainerRO.disconnect()
  })

  return {
    bottomContainerHeight,
  }
}
