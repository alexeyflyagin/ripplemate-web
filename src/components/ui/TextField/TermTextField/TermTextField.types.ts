import type { Component } from 'vue'

export interface ActionCaptionData {
  icon: Component
  value: string
  caption: string
  closable?: boolean
  hide?: boolean
  onClose?: () => void
}
