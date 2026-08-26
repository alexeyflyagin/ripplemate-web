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
import { useInitialScroll } from './useInitialScroll.ts'

const props = withDefaults(
  defineProps<{
    width?: string
    targetEl: ReferenceElement
    items: MenuItemData[]
    payload?: string
    placement?: Placement
    offsetOptions?: OffsetOptions
    initialScrollToId?: string
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

const elements = ref<Map<string, HTMLElement>>(new Map())
const overlayRef = useTemplateRef('overlay')
const menuEl = ref<HTMLElement>()

const isPositioned = ref<boolean>(false)

const { x, y, maxHeight } = useContextMenuPosition(
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

useInitialScroll(elements, menuEl, props.initialScrollToId)
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
        maxHeight: maxHeight ? maxHeight + 'px' : undefined,
      }"
      @click.stop
      @contextmenu.stop.prevent
    >
      <MenuItem
        v-for="item in items"
        :ref="
          (el: any) => {
            if (el) elements.set(item.id, el.$el)
            else elements.delete(item.id)
          }
        "
        :key="item.id"
        v-bind="item"
        @click="emit('clickItem', item, props.payload)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/blur' as *;

.context-menu-overlay {
  position: fixed;
  inset: 0;
}

.context-menu {
  @include hide-scrollbar;
  @include elevation-4;
  @include background-blur-10;
  position: fixed;
  min-width: 180px;
  overflow-y: auto;
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
