import type { Component } from 'vue'

export interface BaseIconButtonData {
  icon: Component
  iconSelected?: Component
  selectable?: boolean
  loading?: boolean
  size?: 'default' | 'small'
  variant?: 'default' | 'accent' | 'danger'
  showSelectedBackground?: boolean
  disabled?: boolean
  hide?: boolean
  initAnimation?: boolean
  onClick?: (event: MouseEvent | KeyboardEvent) => void
}
