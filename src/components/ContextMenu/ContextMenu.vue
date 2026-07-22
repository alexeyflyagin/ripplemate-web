<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import type {
  MenuAnchor,
  MenuItemData,
} from './ContextMenu.types.ts'
import MenuItem from './MenuItem.vue'

const isOpened = defineModel<boolean>('isOpened', {
  default: true,
})

const items = defineModel<MenuItemData[]>('items', {
  required: true,
})

const props = withDefaults(
  defineProps<{
    width?: string
    x: number
    y: number
    payload?: object
    anchor?: MenuAnchor
  }>(),
  {
    anchor: 'left-top',
    width: '260px',
  },
)

const emit = defineEmits<{
  clickItem: [item: MenuItemData, payload?: object]
}>()

const menuEl = ref<HTMLElement>()
const finalX = ref(0)
const finalY = ref(0)
const isPositioned = ref(false)
const PADDING = 8

let previouslyFocusedElement: HTMLElement | null = null

watch(isOpened, (value) => {
  if (value) updatePosition()
})

watch(isOpened, async (open) => {
  if (open) {
    previouslyFocusedElement =
      document.activeElement as HTMLElement
    await nextTick()
    document.addEventListener('keydown', onKeydown)
    const focusable = menuEl.value
      ? getFocusableElements(menuEl.value)
      : []
    focusable[0]?.focus()
  } else {
    previouslyFocusedElement?.focus()
    previouslyFocusedElement = null
    document.removeEventListener('keydown', onKeydown)
  }
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

function getFocusableElements(
  container: HTMLElement,
): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      '.menu-item__button:not(:disabled)',
    ),
  )
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (!menuEl.value) return

  const focusable = getFocusableElements(menuEl.value)
  if (focusable.length === 0) return

  const first = focusable[0]!
  const last = focusable.at(-1)!
  const currentIndex = focusable.indexOf(
    document.activeElement as HTMLElement,
  )

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const nextIndex =
      currentIndex === -1 ||
      currentIndex === focusable.length - 1
        ? 0
        : currentIndex + 1
    focusable[nextIndex]!.focus()
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    const prevIndex =
      currentIndex <= 0
        ? focusable.length - 1
        : currentIndex - 1
    focusable[prevIndex]!.focus()
    return
  }

  if (event.key !== 'Tab') return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (
    !event.shiftKey &&
    document.activeElement === last
  ) {
    event.preventDefault()
    first.focus()
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
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
        :class="{ 'context-menu--visible': isPositioned }"
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

.context-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.context-menu {
  @include elevation-4;
  position: fixed;
  min-width: 180px;
  opacity: 0;
  padding-top: var(--space-4);
  background-color: var(--surface);
  border: var(--stroke-subtle) solid var(--border-muted);
  border-radius: var(--corner-large);
}

.context-menu--visible {
  opacity: 1;
}
</style>
