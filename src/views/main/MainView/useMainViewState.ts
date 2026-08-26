import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const VIEWS = ['library', 'flow'] as const
export type MainViewType = (typeof VIEWS)[number]

export type { LibraryMode as NavBarMode } from '@/stores/ui/libraryMode'

export function useCurrentView() {
  const route = useRoute()
  const router = useRouter()

  const currentView = computed<MainViewType>(() =>
    route.name === 'flow' ? 'flow' : 'library',
  )

  function goToView(view: MainViewType) {
    router.push({
      name: view === 'flow' ? 'flow' : 'library',
      params: route.params,
      query: route.query,
    })
  }

  return { currentView, goToView }
}
