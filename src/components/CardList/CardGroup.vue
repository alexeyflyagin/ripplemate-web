<script setup lang="ts">
import CardItem from './CardItem.vue'
import type {
  CardItemData,
  CardPosition,
} from './CardList.types.ts'

const props = defineProps<{
  groupLabel: string
  items: CardItemData[]
}>()

const emit = defineEmits<{
  click: [event: MouseEvent, card: CardItemData]
  contextmenu: [event: MouseEvent, card: CardItemData]
}>()

function definePosition(index: number): CardPosition {
  if (props.items.length <= 1) return 'only-one'
  if (index === 0) return 'first'
  if (index === props.items.length - 1) return 'last'
  return 'middle'
}
</script>

<template>
  <div class="card-group">
    <span class="card-group__label">{{ groupLabel }}</span>
    <div class="card-group__list">
      <CardItem
        v-for="(item, index) in items"
        :key="item.id"
        :position="definePosition(index)"
        v-bind="item"
        @click="emit('click', $event, item)"
        @contextmenu="emit('contextmenu', $event, item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.card-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.card-group__label {
  @include text-label;
  color: var(--text-placeholder);
  user-select: none;
  margin: var(--space-16) var(--space-16) var(--space-8);
}

.card-group__list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
