import { ref, type Ref } from 'vue'

export function useBottomContainer(
  bottomContainerEl: Ref<HTMLElement | undefined>,
) {
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
    bottomContainerHeight,
    observeBottomContainerHeight,
  }
}
