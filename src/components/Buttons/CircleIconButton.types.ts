import type { Component } from 'vue'

export interface CircleIconButtonData {
  icon: Component
  color?: 'default' | 'accent' | 'danger'
  disabled?: boolean
}
