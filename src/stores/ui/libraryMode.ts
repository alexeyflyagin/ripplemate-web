import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'

export type LibraryMode =
  | 'default'
  | 'add-card'
  | 'edit-card'
  | 'search'

export const useLibraryModeStore = defineStore(
  'libraryMode',
  () => {
    const route = useRoute()
    const router = useRouter()

    const internalMode = ref<
      'default' | 'add-card' | 'edit-card'
    >('default')
    const editingCardId = ref<number | null>(null)

    // При смене workspace выходим из add/edit режима (контекст сменился)
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

    function openAdd() {
      editingCardId.value = null
      internalMode.value = 'add-card'
    }

    function openEdit(cardId: number) {
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
      openAdd,
      openEdit,
      openSearch,
      setSearchQuery,
      reset,
    }
  },
)
