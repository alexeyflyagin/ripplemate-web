import type { Component } from 'vue'

export interface MenuItemData {
  id: string
  label: string
  value?: string
  icon?: Component
  showDivider?: boolean
  color?: 'default' | 'danger'
  disabled?: boolean
  selected?: boolean
}

export type MenuClickHandler = (
  item: MenuItemData,
  payload?: string,
) => boolean | void | Promise<boolean | void>
