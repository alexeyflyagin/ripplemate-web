<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type {
  MenuAnchor,
  MenuItemData,
} from './ContextMenu.types.ts'
import MenuItem from './MenuItem.vue'

const PADDING = 8

const props = withDefaults(
  defineProps<{
    width?: string
    x: number
    y: number
    items: MenuItemData[]
    payload?: string
    anchor?: MenuAnchor
  }>(),
  {
    anchor: 'left-top',
    width: '200px',
  },
)

const emit = defineEmits<{
  clickItem: [
    item: MenuItemData,
    payload: string | undefined,
  ]
}>()

const isOpened = defineModel<boolean>('isOpened', {
  default: false,
})

const menuEl = ref<HTMLElement>()

const finalX = ref<number>(0)
const finalY = ref<number>(0)
const isPositioned = ref<boolean>(false)

watch(isOpened, async (open) => {
  if (open) updatePosition()
})

async function updatePosition() {
  isPositioned.value = false
  await nextTick()

  const menu = menuEl.value
  if (!menu) return

  const menuWidth = menu.offsetWidth
  const menuHeight = menu.offsetHeight
  const vw = window.innerWidth
  const vh = window.innerHeight

  let x = props.x
  let y = props.y

  switch (props.anchor) {
    case 'left-top':
      break
    case 'center-top':
      x = props.x - menuWidth / 2
      break
    case 'right-top':
      x = props.x - menuWidth
      break
    case 'left-bottom':
      y = props.y - menuHeight
      break
    case 'center-bottom':
      x = props.x - menuWidth / 2
      y = props.y - menuHeight
      break
    case 'right-bottom':
      x = props.x - menuWidth
      y = props.y - menuHeight
      break
  }

  if (x + menuWidth > vw - PADDING) x = props.x - menuWidth
  if (y + menuHeight > vh - PADDING)
    y = props.y - menuHeight

  x = Math.min(
    Math.max(x, PADDING),
    vw - menuWidth - PADDING,
  )
  y = Math.min(
    Math.max(y, PADDING),
    vh - menuHeight - PADDING,
  )

  finalX.value = x
  finalY.value = y
  isPositioned.value = true
}

function close() {
  isOpened.value = false
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpened"
      class="context-menu-overlay"
      @click="close"
      @contextmenu.prevent="close"
    >
      <div
        ref="menuEl"
        class="context-menu"
        :class="{
          'context-menu--visible': isPositioned,
        }"
        :style="{
          left: finalX + 'px',
          top: finalY + 'px',
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
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/blur' as *;

.context-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.context-menu {
  @include elevation-4;
  @include background-blur-30;
  position: fixed;
  min-width: 180px;
  opacity: 0;
  padding-top: var(--space-4);
  background-color: color-mix(
    in srgb,
    var(--surface) 60%,
    transparent
  );
  border-radius: var(--corner-xlarge);
  transition:
    transform 0.16s cubic-bezier(0, 1.6, 0.6, 1.6),
    opacity 0.16s cubic-bezier(0, 1.6, 0.6, 1.6);
  transform: scale(0.96);
}

.context-menu--visible {
  opacity: 1;
  transform: scale(1);
}
</style>
