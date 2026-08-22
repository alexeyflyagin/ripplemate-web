import type { NavItemData } from '@/components/ui/NavBar'
import HomeIcon from '~icons/icons-16/home'
import HomeFilledIcon from '~icons/icons-16/home-filled'
import PlayIcon from '~icons/icons-16/play'
import PlayFilledIcon from '~icons/icons-16/play-filled'
import { computed, type Ref } from 'vue'
import {
  VIEWS,
  type MainViewTypes,
} from './useMainViewState'

export function useNavBar(currentView: Ref<MainViewTypes>) {
  const items = computed<NavItemData[]>(() =>
    VIEWS.map<NavItemData>((v) => {
      switch (v) {
        case 'home':
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
    if (!VIEWS.find((v) => v == id)) return
    currentView.value = id as MainViewTypes
  }

  return {
    items,
    setSelectedNavItemId,
  }
}
