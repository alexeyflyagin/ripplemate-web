<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { MenuItemData } from './ContextMenu.types.ts'
import MenuItem from './MenuItem.vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useMoveFocus } from '@/composables/useMoveFocus.ts'
import {
  type OffsetOptions,
  type Placement,
  type ReferenceElement,
} from '@floating-ui/dom'
import { useContextMenuPosition } from './useContextMenuPosition.ts'

const props = withDefaults(
  defineProps<{
    width?: string
    targetEl: ReferenceElement
    items: MenuItemData[]
    payload?: string
    placement?: Placement
    offsetOptions?: OffsetOptions
  }>(),
  {
    placement: 'bottom-start',
    width: '200px',
  },
)

const emit = defineEmits<{
  clickItem: [
    item: MenuItemData,
    payload: string | undefined,
  ]
  close: []
}>()

const overlayRef = useTemplateRef('overlay')
const menuEl = ref<HTMLElement>()

const isPositioned = ref<boolean>(false)

const { x, y } = useContextMenuPosition(
  props.targetEl,
  menuEl,
  {
    offsetOptions: props.offsetOptions,
    placement: props.placement,
    after: () => {
      isPositioned.value = true
    },
  },
)

useFocusTrap(overlayRef, {
  immediate: true,
})

useMoveFocus(menuEl, { withArrows: true })
</script>

<template>
  <div
    class="context-menu-overlay"
    ref="overlay"
    @click="emit('close')"
    @contextmenu.prevent="emit('close')"
  >
    <div
      ref="menuEl"
      class="context-menu"
      :class="{
        'context-menu--visible': isPositioned,
      }"
      :style="{
        left: x + 'px',
        top: y + 'px',
        width: width,
      }"
      @click.stop
      @contextmenu.stop.prevent
    >
      <MenuItem
        v-for="item in items"
        :key="item.id"
        v-bind="item"
        @click="emit('clickItem', item, props.payload)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/blur' as *;

.context-menu-overlay {
  position: fixed;
  inset: 0;
}

.context-menu {
  @include elevation-4;
  @include background-blur-10;
  position: fixed;
  min-width: 180px;
  opacity: 0;
  padding-top: var(--space-4);
  background-color: var(--surface-60);
  border-radius: var(--corner-xlarge);
  transition:
    transform 0.2s var(--ease-bounce),
    opacity 0.2s var(--ease-bounce);
  transform: scale(0.94);
}

.context-menu--visible {
  opacity: 1;
  transform: scale(1);
}
</style>
