import type { ActionCaptionData } from '@/components/ui/TextField/TermTextField'
import { useCardStore } from '@/stores/domain/card'
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
import CloseIcon from '~icons/icons-16/close'
import type { CardRead } from '@/api/types'
import type { BaseIconButtonData } from '@/components/ui/Button/BaseIconButton'

export function useTermTextField(t: ComposerTranslation) {
  const cardStore = useCardStore()
  const libraryMode = useLibraryModeStore()
  const { currentWorkspaceId } = useCurrentWorkspace()
  const { currentCategoryId } = useCurrentCategory()

  const mode = computed(() => libraryMode.mode)
  const editedCard = ref<CardRead | undefined>()

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
        return { icon: CaretLeftIcon }
      default:
        return undefined
    }
  })

  const sumbitButtonData = computed<
    BaseIconButtonData | undefined
  >(() => {
    switch (libraryMode.mode) {
      case 'default':
        return {
          icon: PlusIcon,
          variant: 'accent',
        }
      case 'edit-card':
        return {
          icon: TickIcon,
          variant: 'accent',
          hide: !termFieldValue.value.trim(),
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
          }
      default:
        return undefined
    }
  })

  async function onSubmitClick() {
    if (!currentWorkspaceId.value) return

    switch (libraryMode.mode) {
      case 'default':
        if (!termFieldValue.value.trim()) return
        await cardStore.createCard(
          currentWorkspaceId.value,
          currentCategoryId.value ?? null,
          {
            term: termFieldValue.value,
            category_id: currentCategoryId.value ?? null,
          },
        )
        termFieldValue.value = ''
        break
      case 'edit-card':
        if (editedCard.value) {
          await cardStore.updateCard(
            currentWorkspaceId.value,
            currentCategoryId.value ?? null,
            editedCard.value.id,
            {
              term: termFieldValue.value.trim(),
            },
          )
        }
        termFieldValue.value = ''
        libraryMode.reset()
        break
    }
  }

  function onLeadingClick() {
    libraryMode.reset()
  }

  return {
    collapsed: readonly(collapsed),
    mode,
    termFieldValue,
    actionCaptionData,
    placeholder,
    leadingButtonData,
    sumbitButtonData,
    secondaryButtonData,
    onSubmitClick,
    onLeadingClick,
    editCard,
  }
}
