import type { Component } from 'vue'

export type MenuAnchor =
  | 'left-top'
  | 'center-top'
  | 'right-top'
  | 'left-bottom'
  | 'center-bottom'
  | 'right-bottom'

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
  payload?: object,
) => boolean | void | Promise<boolean | void>
