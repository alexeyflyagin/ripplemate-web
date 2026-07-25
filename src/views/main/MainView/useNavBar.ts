import type { NavItemData } from '@/components/NavBar/NavBar.types'
import HomeIcon from '~icons/icons-16/home'
import HomeFilledIcon from '~icons/icons-16/home-filled'
import PlayIcon from '~icons/icons-16/play'
import PlayFilledIcon from '~icons/icons-16/play-filled'
import { computed, ref } from 'vue'

export function useNavBar() {
  const selectedIndex = ref<number>()
  const selectedNavItemId = computed(() => {
    return (
      items.value[selectedIndex.value ?? 0]?.id ?? 'home'
    )
  })

  const items = ref<NavItemData[]>([
    {
      id: 'home',
      icon: HomeIcon,
      iconSelected: HomeFilledIcon,
    },
    {
      id: 'flow',
      icon: PlayIcon,
      iconSelected: PlayFilledIcon,
    },
  ])

  return { selectedIndex, selectedNavItemId, items }
}
