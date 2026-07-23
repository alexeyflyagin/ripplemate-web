import { defineStore } from 'pinia'
import {
  computed,
  ref,
  unref,
  type ComputedRef,
  type Ref,
} from 'vue'
import type {
  MenuAnchor,
  MenuClickHandler,
  MenuItemData,
} from '@/components/ContextMenu/ContextMenu.types'

export interface OpenMenuData {
  posX: number
  posY: number
  menuItems:
    | Ref<MenuItemData[]>
    | ComputedRef<MenuItemData[]>
  menuAnchor?: MenuAnchor
  handler?: MenuClickHandler
}

export const useContextMenuStore = defineStore(
  'contextMenu',
  () => {
    const isOpened = ref(false)
    const itemsSource = ref<
      | Ref<MenuItemData[]>
      | ComputedRef<MenuItemData[]>
      | null
    >(null)
    const x = ref(0)
    const y = ref(0)
    const anchor = ref<MenuAnchor | undefined>()

    const items = computed<MenuItemData[]>(() => {
      const source = itemsSource.value
      if (!source) return []
      return unref(source)
    })

    let onItemClick: MenuClickHandler | undefined | null =
      null

    function open(openData: OpenMenuData) {
      x.value = openData.posX
      y.value = openData.posY
      anchor.value = openData.menuAnchor
      itemsSource.value = openData.menuItems
      onItemClick = openData.handler
      isOpened.value = true
    }

    function close() {
      isOpened.value = false
      onItemClick = null
    }

    async function handleClick(
      item: MenuItemData,
      payload: object | undefined,
    ) {
      if (!onItemClick) return

      const res = await onItemClick(item, payload)
      if (res !== false) close()
    }

    return {
      isOpened,
      items,
      x,
      y,
      anchor,
      open,
      close,
      handleClick,
    }
  },
)
