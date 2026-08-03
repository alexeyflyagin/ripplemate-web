<script setup lang="ts">
import CardGroup from './CardGroup.vue'
import type {
  CardGroupData,
  CardItemData,
} from './CardList.types.ts'

defineProps<{
  groups: CardGroupData[]
}>()

const emit = defineEmits<{
  click: [event: MouseEvent, card: CardItemData]
  contextmenu: [event: MouseEvent, card: CardItemData]
}>()
</script>

<template>
  <div class="scroll-view">
    <div class="scroll-view__list">
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
  scrollbar-width: none;
}

.scroll-view__list {
  padding: 0 var(--space-16);
}
</style>
