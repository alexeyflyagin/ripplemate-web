import type { Component } from 'vue'

export interface RoundIconButtonData {
  icon: Component
  color?: 'default' | 'accent' | 'danger'
  disabled?: boolean
}
