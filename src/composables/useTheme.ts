// composables/useTheme.ts
export type Theme = 'light' | 'dark' | 'auto'

export function applyTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'auto' &&
      window.matchMedia('(prefers-color-scheme: dark)')
        .matches)

  document.documentElement.classList.toggle('dark', isDark)
}
