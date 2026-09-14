<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { MenuItemData } from './ContextMenu.types.ts'
import MenuItem from './MenuItem.vue'
import { useManagedFocusTrap } from '@/composables/useManagedFocusTrap.ts'
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

useManagedFocusTrap(overlayRef, {
  immediate: true,
})

useMoveFocus(menuEl, { withArrows: true })

useInitialScroll(elements, menuEl, props.initialScrollToId)

// Note: the trap is intentionally NOT deactivated here. Whether the
// menu closes after an item click is entirely up to the caller (see
// e.g. useProfileMenu, where most items keep the menu open so several
// toggles can be picked in a row, and only some close it via
// `overlay.close()`). Deactivating on every click regardless of
// whether the menu actually closes left it open-but-untrapped, which
// fights with any parent trap (e.g. the mobile sidebar's) that
// reactivates once this one deactivates. Real cleanup happens in
// useManagedFocusTrap's onBeforeUnmount once the menu is actually
// removed from the DOM.
function onClickItem(item: MenuItemData) {
  emit('clickItem', item, props.payload)
}
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
        @click="onClickItem(item)"
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
  @include elevation-1;
  @include background-blur-15;
  position: fixed;
  min-width: 180px;
  overflow-y: auto;
  opacity: 0;
  outline: var(--stroke-subtle) solid var(--border-muted);
  padding-top: var(--space-4);
  background-color: var(--surface-highest-60);
  border-radius: var(--corner-xlarge);
  transition:
    transform 0.1s var(--ease-emphasized),
    opacity 0.1s var(--ease-emphasized);
}

.context-menu--visible {
  opacity: 1;
}
</style>
