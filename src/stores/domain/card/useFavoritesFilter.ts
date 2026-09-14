import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useFavoritesFilter() {
  const route = useRoute()
  const router = useRouter()

  const favoritesOnly = computed<boolean>({
    get: () => route.query.favorite === '1',
    set: (value) => {
      const query = { ...route.query }
      if (value) query.favorite = '1'
      else delete query.favorite
      router.replace({ query })
    },
  })

  return { favoritesOnly }
}
