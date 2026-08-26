import type { NavItemData } from '@/components/ui/NavBar'
import HomeIcon from '~icons/icons-16/home'
import HomeFilledIcon from '~icons/icons-16/home-filled'
import PlayIcon from '~icons/icons-16/play'
import PlayFilledIcon from '~icons/icons-16/play-filled'
import { computed } from 'vue'
import { VIEWS, useCurrentView } from './useMainViewState'

export function useNavBar() {
  const { currentView, goToView } = useCurrentView()

  const items = computed<NavItemData[]>(() =>
    VIEWS.map<NavItemData>((v) => {
      switch (v) {
        case 'library':
          return {
            id: v,
            icon: HomeIcon,
            iconSelected: HomeFilledIcon,
          }
        case 'flow':
          return {
            id: v,
            icon: PlayIcon,
            iconSelected: PlayFilledIcon,
          }
        default:
          throw Error('Unexpected type of view')
      }
    }),
  )

  function setSelectedNavItemId(id: string) {
    const view = VIEWS.find((v) => v === id)
    if (!view) return
    goToView(view)
  }

  return {
    currentView,
    items,
    setSelectedNavItemId,
  }
}
