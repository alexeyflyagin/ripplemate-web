import { ref } from 'vue'

export function useBottomContainer() {
  const bottomContainerEl = ref<HTMLElement>()
  const bottomContainerHeight = ref<number>(0)

  const bottomContainerResizeObserver: ResizeObserver =
    new ResizeObserver(() => {
      bottomContainerHeight.value =
        document
          .querySelector('.bottom-container')
          ?.getBoundingClientRect().height ?? 0
    })

  function observeBottomContainerHeight() {
    if (bottomContainerEl.value) {
      bottomContainerResizeObserver.observe(
        bottomContainerEl.value,
      )
    }
  }

  return {
    bottomContainerEl,
    bottomContainerHeight,
    observeBottomContainerHeight,
  }
}
