import type { RoundIconButtonData } from '@/components/ui/Button/RoundIconButton'
import type { ActionCaptionData } from '@/components/ui/TextField/TermTextField'
import { useCardStore } from '@/stores/domain/card'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useLibraryModeStore } from '@/stores/ui/libraryMode'
import { computed, ref, watch } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import SearchIcon from '~icons/icons-12/search'
import EditIcon from '~icons/icons-12/edit'
import CircleCloseIcon from '~icons/icons-16/circle-close'
import PlusIcon from '~icons/icons-16/plus'
import TickIcon from '~icons/icons-16/tick'
import CaretLeftIcon from '~icons/icons-16/caret-left'
import CloseIcon from '~icons/icons-16/close'
import type { CardRead } from '@/api/types'

export function useTermTextField(t: ComposerTranslation) {
  const cardStore = useCardStore()
  const libraryMode = useLibraryModeStore()
  const { currentWorkspaceId } = useCurrentWorkspace()
  const { currentCategoryId } = useCurrentCategory()

  const mode = computed(() => libraryMode.mode)
  const editedCard = ref<CardRead | undefined>()

  const termFieldValue = ref<string>('')

  // Текст поиска синхронизируется с URL (?q=) и с cardStore
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
        // при входе в поиск подхватываем текст из URL
        termFieldValue.value = libraryMode.searchQuery
        cardStore.setSearch(libraryMode.searchQuery.trim() || null)
      } else {
        termFieldValue.value = ''
        cardStore.setSearch(null)
      }
    },
    { immediate: true },
  )

  async function editCard(cardId: number) {
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
        }
      default:
        return undefined
    }
  })

  const placeholder = computed<string | undefined>(() => {
    switch (libraryMode.mode) {
      case 'add-card':
        return t('general.label.term')
      case 'search':
        return t('general.action.search')
      default:
        return undefined
    }
  })

  const leadingButtonData = computed<
    RoundIconButtonData | undefined
  >(() => {
    switch (libraryMode.mode) {
      case 'edit-card':
        return {
          icon: CloseIcon,
          color: 'danger',
        }
      default:
        return { icon: CaretLeftIcon }
    }
  })

  const sumbitButtonData = computed<
    RoundIconButtonData | undefined
  >(() => {
    switch (libraryMode.mode) {
      case 'add-card':
        return {
          icon: PlusIcon,
          color: 'accent',
          disabled: !termFieldValue.value.trim(),
        }
      case 'edit-card':
        return {
          icon: TickIcon,
          color: 'accent',
          disabled: !termFieldValue.value.trim(),
        }
      default:
        return undefined
    }
  })

  const secondaryButtonData = computed<
    RoundIconButtonData | undefined
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
      case 'add-card':
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
