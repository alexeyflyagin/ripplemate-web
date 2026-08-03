<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import CardGroup from './CardGroup.vue'
import type {
  CardGroupData,
  CardItemData,
} from './CardList.types.ts'

const props = defineProps<{
  groups: CardGroupData[]
}>()

const scrollView = ref<HTMLElement>()
const scrollListView = ref<HTMLElement>()

const emit = defineEmits<{
  click: [event: MouseEvent, card: CardItemData]
  contextmenu: [event: MouseEvent, card: CardItemData]
}>()

watch(
  () => props.groups,
  async () => {
    await nextTick()

    if (!scrollView.value || !scrollListView.value) return

    scrollView.value.scrollTop =
      scrollListView.value.offsetHeight
  },
)
</script>

<template>
  <div class="scroll-view" ref="scrollView">
    <div class="scroll-view__list" ref="scrollListView">
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
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-top: auto;
  scrollbar-width: none;
}

.scroll-view__list {
  padding: 0 var(--space-16);
}
</style>
