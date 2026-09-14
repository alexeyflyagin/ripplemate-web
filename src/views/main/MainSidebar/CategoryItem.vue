<script setup lang="ts">
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
import { ref } from 'vue'
import MoreHorizontalIcon from '~icons/icons-16/more-horizontal'
import FolderIcon from '~icons/icons-16/folder'
import FolderFilledIcon from '~icons/icons-16/folder-filled'

defineProps<{
  label: string
  active?: boolean
  selected?: boolean
  more?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
  contextmenu: [event: MouseEvent | KeyboardEvent]
}>()

const showActions = ref<boolean>(false)
</script>

<template>
  <div class="category-item-wrapper">
    <div
      class="category-item"
      :class="{
        'category-item--active': active,
        'category-item--selected': selected && !active,
      }"
      tabindex="0"
      role="button"
      @mouseenter="showActions = true"
      @mouseleave="showActions = false"
      @click="emit('click', $event)"
      @contextmenu.prevent
      @keydown.enter="emit('click', $event)"
      @keydown.space.prevent="emit('click', $event)"
    >
      <component
        class="category-item__icon"
        :is="active ? FolderFilledIcon : FolderIcon"
      />
      <span class="category-item__label">{{ label }}</span>
      <div
        v-if="showActions || active || selected"
        class="category-item__actions"
      >
        <BaseIconButton
          v-if="more"
          class="category-item__more-button"
          size="small"
          :selected="selected"
          :selectable="selected"
          :icon="MoreHorizontalIcon"
          @click.stop="emit('contextmenu', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/text-styles' as *;

.category-item {
  @include text-caption-emphasized;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 38px;
  border-radius: var(--corner-large);
  background-color: transparent;
  color: var(--text);
  overflow: hidden;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--text);
    opacity: 0;
    pointer-events: none;
  }

  &--active {
    background-color: var(--text-10);
  }

  &--selected {
    &::after {
      opacity: var(--opacity-8);
    }
  }

  @media (hover: hover) {
    &:hover {
      &::after {
        opacity: var(--opacity-8);
      }
    }
    &:hover.category-item--active {
      &::after {
        opacity: 0;
      }
    }
  }

  &:focus-visible {
    @include focus-outline;
  }

  &__icon {
    width: 16px;
    height: 16px;
    padding-left: var(--space-12);
  }

  &__label {
    text-align: start;
    margin: var(--space-8) var(--space-12);
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__actions {
    display: inline-flex;
    flex-shrink: 0;
    padding: var(--space-2) var(--space-2) var(--space-2) 0;
  }

  &__more-button {
    border-radius: 10px;
  }
}
</style>
