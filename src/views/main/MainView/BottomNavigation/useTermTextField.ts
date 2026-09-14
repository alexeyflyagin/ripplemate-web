import type { ActionCaptionData } from '@/components/ui/TextField/TermTextField'
import { useCardStore } from '@/stores/domain/card'
import { useFavoritesFilter } from '@/stores/domain/card/useFavoritesFilter'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useLibraryModeStore } from '@/stores/ui/libraryMode'
import { computed, readonly, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import SearchIcon from '~icons/icons-16/search'
import EditIcon from '~icons/icons-16/edit'
import CircleCloseIcon from '~icons/icons-16/circle-close'
import PlusIcon from '~icons/icons-16/plus'
import TickIcon from '~icons/icons-16/tick'
import CaretLeftIcon from '~icons/icons-16/caret-left'
import type { CardRead } from '@/api/types'
import type { BaseIconButtonData } from '@/components/ui/Button/BaseIconButton'

export function useTermTextField(t: ComposerTranslation) {
  const cardStore = useCardStore()
  const libraryMode = useLibraryModeStore()
  const { currentWorkspaceId } = useCurrentWorkspace()
  const { currentCategoryId } = useCurrentCategory()
  const { favoritesOnly } = useFavoritesFilter()

  const mode = computed(() => libraryMode.mode)
  const editedCard = ref<CardRead | undefined>()
  const isCreatingCard = ref<boolean>(false)
  const isUpdatingCard = ref<boolean>(false)

  const collapsed = computed(
    () =>
      libraryMode.mode === 'default' &&
      !termFieldValue.value,
  )

  const termFieldValue = ref<string>('')

  watch(termFieldValue, (v) => {
    if (libraryMode.mode === 'search') {
      libraryMode.setSearchQuery(v)
      cardStore.setSearch(v.trim())
    }
  })

  watch(
    () => libraryMode.mode,
    (m) => {
      if (m === 'search') {
        termFieldValue.value = libraryMode.searchQuery
        cardStore.setSearch(
          libraryMode.searchQuery.trim() || null,
        )
      } else {
        termFieldValue.value = ''
        cardStore.setSearch(null)
      }
    },
    { immediate: true },
  )

  async function editCard(cardId: string) {
    if (!currentWorkspaceId.value) return
    editedCard.value = await cardStore.getCard(
      currentWorkspaceId.value,
      cardId,
    )
    if (!editedCard.value) return

    termFieldValue.value = editedCard.value.term
  }

  const actionCaptionData = computed<
    ActionCaptionData | undefined
  >(() => {
    switch (libraryMode.mode) {
      case 'search':
        return {
          icon: SearchIcon,
          caption: t('general.label.results') + ':',
          value: String(cardStore.total),
        }
      case 'edit-card':
        if (!editedCard.value) return undefined
        return {
          icon: EditIcon,
          caption: t('general.label.editing') + ':',
          value: editedCard.value.term,
          closable: true,
          onClose: libraryMode.reset,
        }
      default:
        return undefined
    }
  })

  const placeholder = computed<string | undefined>(() => {
    switch (libraryMode.mode) {
      case 'search':
        return t('general.action.search')
      case 'default':
        return t('general.label.term')
      default:
        return undefined
    }
  })

  const leadingButtonData = computed<
    BaseIconButtonData | undefined
  >(() => {
    switch (libraryMode.mode) {
      case 'search':
        return {
          icon: CaretLeftIcon,
          onClick: () => {
            libraryMode.reset()
          },
        }
      default:
        return undefined
    }
  })

  const sumbitButtonData = computed<
    BaseIconButtonData | undefined
  >(() => {
    switch (libraryMode.mode) {
      case 'default':
        if (!termFieldValue.value.trim()) return undefined
        return {
          icon: PlusIcon,
          variant: 'accent',
          initAnimation: true,
          loading: isCreatingCard.value,
          onClick: async () => {
            if (isCreatingCard.value) return
            if (!currentWorkspaceId.value) return
            if (!termFieldValue.value.trim()) return

            isCreatingCard.value = true
            try {
              const workspaceId = currentWorkspaceId.value
              const categoryId =
                currentCategoryId.value ?? null

              const created = await cardStore.createCard(
                workspaceId,
                categoryId,
                {
                  term: termFieldValue.value,
                  category_id: categoryId,
                },
              )

              if (favoritesOnly.value) {
                await cardStore.updateCard(
                  workspaceId,
                  categoryId,
                  created.id,
                  { is_favorite: true },
                )
              }

              termFieldValue.value = ''
            } finally {
              isCreatingCard.value = false
            }
          },
        }
      case 'edit-card':
        return {
          icon: TickIcon,
          variant: 'accent',
          hide: !termFieldValue.value.trim(),
          loading: isUpdatingCard.value,
          onClick: async () => {
            if (isUpdatingCard.value) return
            if (!currentWorkspaceId.value) return
            if (!editedCard.value) return

            const cardId = editedCard.value.id
            const term = termFieldValue.value.trim()

            isUpdatingCard.value = true
            try {
              await cardStore.updateCard(
                currentWorkspaceId.value,
                currentCategoryId.value ?? null,
                cardId,
                { term },
              )

              if (editedCard.value?.id !== cardId) return
              termFieldValue.value = ''
              libraryMode.reset()
            } finally {
              isUpdatingCard.value = false
            }
          },
        }
      default:
        return undefined
    }
  })

  const secondaryButtonData = computed<
    BaseIconButtonData | undefined
  >(() => {
    switch (libraryMode.mode) {
      case 'search':
        if (termFieldValue.value.trim())
          return {
            icon: CircleCloseIcon,
            onClick: () => {
              termFieldValue.value = ''
            },
          }
      default:
        return undefined
    }
  })

  return {
    collapsed: readonly(collapsed),
    mode,
    termFieldValue,
    actionCaptionData,
    placeholder,
    leadingButtonData,
    sumbitButtonData,
    secondaryButtonData,
    editCard,
  }
}
