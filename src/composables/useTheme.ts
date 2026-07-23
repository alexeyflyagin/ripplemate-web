import { getNextInArray } from '@/utils/getNextInArray'

export const THEMES = ['auto', 'dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

function resolveTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
  }
  return theme
}

export function watchSystemTheme(
  onSystemThemeChange: () => void,
) {
  const mediaQuery = window.matchMedia(
    '(prefers-color-scheme: dark)',
  )
  mediaQuery.addEventListener('change', onSystemThemeChange)
  return () =>
    mediaQuery.removeEventListener(
      'change',
      onSystemThemeChange,
    )
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute(
    'data-theme',
    resolveTheme(theme),
  )
}

export function getNextTheme(current: Theme): Theme {
  return getNextInArray(THEMES, current)
}
