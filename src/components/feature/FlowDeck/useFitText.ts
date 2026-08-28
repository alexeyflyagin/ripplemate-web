import { useSettingsStore } from '@/stores/domain/settings'
import {
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  type Ref,
} from 'vue'

export function useFitText(
  el: Ref<HTMLElement | undefined>,
  container: Ref<HTMLElement | undefined>,
  text: Ref<string>,
  {
    max = 28,
    min = 6,
  }: { max?: number; min?: number } = {},
) {
  const settingsStore = useSettingsStore()
  let ro: ResizeObserver | null = null

  async function fit() {
    const node = el.value
    const box = container.value
    if (!node || !box) return
    await nextTick()

    let size = max
    node.style.fontSize = size + 'px'

    while (
      size > min &&
      (node.scrollHeight > box.clientHeight ||
        node.scrollWidth > box.clientWidth)
    ) {
      size -= 1
      node.style.fontSize = size + 'px'
    }
  }

  watch(
    () => settingsStore.font,
    (v) => fit(),
  )

  onMounted(() => {
    fit()
    if (container.value) {
      ro = new ResizeObserver(() => fit())
      ro.observe(container.value)
    }
  })

  onUnmounted(() => ro?.disconnect())
  watch(text, fit)

  return { fit }
}
