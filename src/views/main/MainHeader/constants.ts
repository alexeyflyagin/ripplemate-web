import type { Component } from 'vue'
import SerifIcon from '~icons/icons-16/serif'
import SansSerifIcon from '~icons/icons-16/sans-serif'
import DayIcon from '~icons/icons-16/day'
import NightIcon from '~icons/icons-16/night'
import type { Font, Theme } from '@/api/types'

export const FONT_ICONS: Record<Font, Component> = {
  serif: SerifIcon,
  'sans-serif': SansSerifIcon,
}

export const THEME_ICONS: Record<
  Exclude<Theme, 'auto'>,
  Component
> = {
  dark: NightIcon,
  light: DayIcon,
}
