import { onMounted, ref, watch } from 'vue'

export const VIEWS = ['home', 'flow'] as const
export type MainViewTypes = (typeof VIEWS)[number]

export type NavBarMode =
  | 'default'
  | 'add-card'
  | 'edit-card'
  | 'search'

export function useMainViewStates() {
  const currentView = ref<MainViewTypes>('home')
  const mode = ref<NavBarMode>('default')
  let defaultHistory = true

  watch(mode, (v) => {
    if (v !== 'default') {
      history.pushState({ mode: v }, '')
      defaultHistory = false
      window.addEventListener('popstate', onPopState)
      window.addEventListener('keydown', onKeyDown)
    } else if (!defaultHistory) {
      history.back()
      clearPopState()
    }
  })

  function onPopState() {
    mode.value = 'default'
    clearPopState()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      mode.value = 'default'
      clearPopState()
    }
  }

  function clearPopState() {
    defaultHistory = true
    window.removeEventListener('popstate', onPopState)
    window.removeEventListener('keydown', onKeyDown)
  }

  return { currentView, mode }
}
