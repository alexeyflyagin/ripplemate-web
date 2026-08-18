import { ref } from 'vue'

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

  return { currentView, mode }
}
