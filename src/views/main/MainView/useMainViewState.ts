import { ref } from 'vue'

export type MainViews = 'home' | 'flow'

export type NavBarMode =
  | 'default'
  | 'add-card'
  | 'edit-card'
  | 'search'

export function useMainViewStates() {
  const currentView = ref<MainViews>('home')
  const mode = ref<NavBarMode>('default')

  return { currentView, mode }
}
