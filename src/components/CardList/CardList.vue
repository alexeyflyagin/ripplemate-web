<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
} from 'vue'
import type { CardRead } from '@/api/types'
import type {
  CardItemData,
  CardGroupLabelData,
  SpacerData,
} from './CardList.types'
import CardItem from './CardItem.vue'
import CardGroupLabel from './CardGroupLabel.vue'
import { convertCards } from './CardList.utils.ts'
import { useDate } from '@/composables/useDate.ts'
import {
  Virtualizer,
  type VirtualizerHandle,
} from 'virtua/vue'

const dateFormatter = useDate()

const props = defineProps<{
  listKey: string
  cards: CardRead[]
  hasMore: boolean
}>()

const emit = defineEmits<{
  loadMore: []
  click: [event: MouseEvent, card: CardItemData]
  contextmenu: [event: MouseEvent, card: CardItemData]
}>()

const items = computed<
  (CardItemData | CardGroupLabelData | SpacerData)[]
>(() => convertCards(props.cards, dateFormatter))

const listRef = ref<VirtualizerHandle>()
const scrollEl = ref<HTMLElement>()
const shift = ref(false)
const initialized = ref(false)
const isAtBottom = ref(true)
const THRESHOLD = 200
const BOTTOM_THRESHOLD = 100

watch(
  () => props.listKey,
  () => {
    initialized.value = false
    const stop = watch(
      () => props.cards,
      async () => {
        await nextTick()
        scrollToBottomInstantly()
        stop()
      },
    )
  },
  { immediate: true },
)

watch(
  () => props.cards.length,
  (newLen, oldLen) => {
    if (!initialized.value) {
      initialized.value = true
      return
    }
    if (oldLen && newLen > oldLen && !shift.value) {
      nextTick(() => scrollToBottom())
    }
  },
  { immediate: true },
)

function onScroll() {
  const el = scrollEl.value
  if (!el) return
  if (el.scrollTop <= THRESHOLD && props.hasMore) {
    shift.value = true
    emit('loadMore')
  } else {
    shift.value = false
  }
  const distanceFromBottom =
    el.scrollHeight - el.scrollTop - el.clientHeight
  isAtBottom.value = distanceFromBottom <= BOTTOM_THRESHOLD
}

function scrollToBottomInstantly() {
  listRef.value?.scrollToIndex(items.value.length - 1)
}

async function scrollToBottom() {
  const el = scrollEl.value
  if (!el || !listRef.value) return

  const distanceFromBottom =
    el.scrollHeight - el.scrollTop - el.clientHeight

  if (distanceFromBottom >= 2000) {
    el.scrollTop = el.scrollHeight - el.clientHeight - 300
  }

  await nextTick()
  listRef.value?.scrollToIndex(items.value.length - 1, {
    smooth: true,
  })
}

const observer = new ResizeObserver(async () => {
  await nextTick()
  if (!isAtBottom.value) return
  scrollToBottomInstantly()
})

defineExpose({ scrollToBottom })

onMounted(async () => {
  await nextTick()
  scrollToBottomInstantly()
  if (scrollEl.value) {
    observer.observe(scrollEl.value)
  }
})
</script>

<template>
  <div
    ref="scrollEl"
    class="card-scroll"
    @scroll="onScroll"
  >
    <div :style="{ flexGrow: 1 }" />

    <Virtualizer
      ref="listRef"
      :data="items"
      :shift="shift"
      #default="{ item }"
    >
      <div
        v-if="item.type === 'top-spacer'"
        :key="'top-spacer'"
        :style="{ height: 'var(--space-80)' }"
      />
      <div
        v-else-if="item.type === 'bottom-spacer'"
        :key="'bottom-spacer'"
        :style="{
          height:
            'var(--bottom-container-height, var(--space-24))',
        }"
      />
      <CardGroupLabel
        v-else-if="item.type === 'label'"
        :key="item.key"
        :label="item.label"
        :style="{
          maxWidth: 'var(--max-content-width-680)',
          marginRight: 'auto',
          marginLeft: 'auto',
          paddingLeft: 'var(--space-16)',
          paddingRight: 'var(--space-16)',
          boxSizing: 'border-box',
        }"
      />
      <CardItem
        v-else-if="item.type === 'card'"
        :key="`c-${item.id}`"
        v-bind="item"
        :style="{
          maxWidth: 'var(--max-content-width-680)',
          marginBottom:
            item.position === 'last'
              ? '0'
              : 'var(--space-2)',
          marginRight: 'auto',
          marginLeft: 'auto',
          paddingLeft: 'var(--space-16)',
          paddingRight: 'var(--space-16)',
          boxSizing: 'border-box',
        }"
        @contextmenu="emit('contextmenu', $event, item)"
        @click="emit('click', $event, item)"
      />
    </Virtualizer>
  </div>
</template>

<style lang="scss" scoped>
.card-scroll {
  display: flex;
  height: 100%;
  overscroll-behavior: none;
  flex-direction: column;
  overflow-y: auto;
  overflow-anchor: none;
  scrollbar-width: none;
  min-height: 0;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
