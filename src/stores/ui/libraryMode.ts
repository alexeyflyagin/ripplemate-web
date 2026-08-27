import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'

export type LibraryMode =
  | 'default'
  | 'edit-card'
  | 'search'

export const useLibraryModeStore = defineStore(
  'libraryMode',
  () => {
    const route = useRoute()
    const router = useRouter()

    const internalMode = ref<'default' | 'edit-card'>(
      'default',
    )
    const editingCardId = ref<string | null>(null)

    watch(
      () => route.params.workspaceId,
      () => {
        internalMode.value = 'default'
        editingCardId.value = null
      },
    )

    const isSearch = computed(
      () => route.query.q !== undefined,
    )

    const searchQuery = computed<string>(() => {
      const q = route.query.q
      return typeof q === 'string' ? q : ''
    })

    function setSearchQuery(value: string) {
      router.replace({
        query: { ...route.query, q: value },
      })
    }

    const mode = computed<LibraryMode>(() => {
      if (isSearch.value) return 'search'
      return internalMode.value
    })

    function openEdit(cardId: string) {
      editingCardId.value = cardId
      internalMode.value = 'edit-card'
    }

    function openSearch() {
      router.replace({ query: { ...route.query, q: '' } })
    }

    function reset() {
      internalMode.value = 'default'
      editingCardId.value = null

      if (isSearch.value) {
        const query = { ...route.query }
        delete query.q
        router.replace({ query })
      }
    }

    onKeyStroke('Escape', () => {
      if (mode.value !== 'default') reset()
    })

    return {
      mode,
      editingCardId,
      searchQuery,
      openEdit,
      openSearch,
      setSearchQuery,
      reset,
    }
  },
)
