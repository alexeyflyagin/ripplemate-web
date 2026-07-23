import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  MenuClickHandler,
  MenuItemData,
} from '@/components/ContextMenu/ContextMenu.types'

export const useContextMenuStore = defineStore(
  'contextMenu',
  () => {
    const isOpened = ref(false)
    const items = ref<MenuItemData[]>([])
    const x = ref(0)
    const y = ref(0)

    let onItemClick: MenuClickHandler | null = null

    function open(
      posX: number,
      posY: number,
      menuItems: MenuItemData[],
      handler: MenuClickHandler,
    ) {
      x.value = posX
      y.value = posY
      items.value = menuItems
      onItemClick = handler
      isOpened.value = true
    }

    function close() {
      isOpened.value = false
      onItemClick = null
    }

    function handleClick(
      item: MenuItemData,
      payload: object | undefined,
    ) {
      if (!onItemClick) return

      const res = onItemClick(item, payload)
      if (res !== false) close()
    }

    return {
      isOpened,
      items,
      x,
      y,
      open,
      close,
      handleClick,
    }
  },
)
