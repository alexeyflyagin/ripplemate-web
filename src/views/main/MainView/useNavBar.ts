import type { NavItemData } from '@/components/ui/NavBar'
import LibraryIcon from '~icons/icons-16/library'
import LibraryFilledIcon from '~icons/icons-16/library-filled'
import CardsIcon from '~icons/icons-16/cards'
import CardsFilledIcon from '~icons/icons-16/cards-filled'
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
            icon: LibraryIcon,
            iconSelected: LibraryFilledIcon,
          }
        case 'flow':
          return {
            id: v,
            icon: CardsIcon,
            iconSelected: CardsFilledIcon,
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
    goToView,
    items,
    setSelectedNavItemId,
  }
}
