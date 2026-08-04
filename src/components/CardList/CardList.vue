<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import CardGroup from './CardGroup.vue'
import type {
  CardGroupData,
  CardItemData,
} from './CardList.types.ts'

const resetScroll = defineModel<boolean>('resetScroll', {
  default: true,
})

defineProps<{
  groups: CardGroupData[]
}>()

let scrollListViewResizeObserver: ResizeObserver | null =
  null
const scrollViewEl = ref<HTMLElement>()
const scrollListViewEl = ref<HTMLElement>()
const scrollOffset = ref<number>(0)

const emit = defineEmits<{
  click: [event: MouseEvent, card: CardItemData]
  contextmenu: [event: MouseEvent, card: CardItemData]
}>()

watch(
  resetScroll,
  (value) => {
    if (!value) return
    scrollToBottom()
  },
  { immediate: true },
)

function scrollToBottom() {
  if (!scrollViewEl.value) return
  scrollOffset.value = 0
  console.log('setScrollToBottom')
}

function onScroll() {
  if (resetScroll.value) return
  if (!scrollViewEl.value) return
  console.log('scroll')
  scrollOffset.value =
    scrollViewEl.value.scrollHeight -
    scrollViewEl.value.scrollTop -
    scrollViewEl.value.offsetHeight
}

onMounted(() => {
  scrollListViewResizeObserver = new ResizeObserver(() => {
    if (!scrollViewEl.value || !scrollListViewEl.value)
      return

    console.log(
      scrollViewEl.value.scrollHeight,
      scrollViewEl.value.offsetHeight,
      scrollOffset.value,
      scrollViewEl.value.scrollHeight -
        scrollViewEl.value.offsetHeight -
        scrollOffset.value,
    )
    scrollViewEl.value.scrollTop =
      scrollViewEl.value.scrollHeight -
      scrollViewEl.value.offsetHeight -
      scrollOffset.value
    resetScroll.value = false
  })

  if (scrollListViewEl.value) {
    scrollListViewResizeObserver.observe(
      scrollListViewEl.value,
    )
  }
})
</script>

<template>
  <div
    class="scroll-view"
    ref="scrollViewEl"
    @scroll="onScroll"
  >
    <div class="scroll-view__list" ref="scrollListViewEl">
      <CardGroup
        v-for="(group, index) in groups"
        :key="index"
        v-bind="group"
        @click="(event, card) => emit('click', event, card)"
        @contextmenu="
          (event, card) => emit('contextmenu', event, card)
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-view {
  height: 100%;
  position: relative;
  overflow: auto;
  scrollbar-width: none;
}

.scroll-view__list {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  padding: 0 var(--space-16);
  min-height: 100%;
}
</style>
