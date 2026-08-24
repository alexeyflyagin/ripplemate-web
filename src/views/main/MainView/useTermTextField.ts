import type { RoundIconButtonData } from '@/components/ui/Button/RoundIconButton'
import type { ActionCaptionData } from '@/components/ui/TextField/TermTextField'
import { useCardStore } from '@/stores/domain/card'
import { useCategoryStore } from '@/stores/domain/category'
import { computed, ref, watch, type Ref } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import SearchIcon from '~icons/icons-12/search'
import EditIcon from '~icons/icons-12/edit'
import CircleCloseIcon from '~icons/icons-16/circle-close'
import PlusIcon from '~icons/icons-16/plus'
import TickIcon from '~icons/icons-16/tick'
import CaretLeftIcon from '~icons/icons-16/caret-left'
import CloseIcon from '~icons/icons-16/close'
import type { NavBarMode } from './useMainViewState'
import type { CardRead } from '@/api/types'

export function useTermTextField(
  t: ComposerTranslation,
  mode: Ref<NavBarMode>,
) {
  const cardStore = useCardStore()
  const categoryStore = useCategoryStore()
  const editedCard = ref<CardRead | undefined>()

  const termFieldValue = ref<string>('')

  watch(termFieldValue, (v) => {
    if (mode.value === 'search')
      cardStore.setSearch(v.trim())
  })

  watch(mode, () => {
    termFieldValue.value = ''
    cardStore.setSearch(null)
  })

  async function editCard(cardId: number) {
    editedCard.value = await cardStore.getCard(cardId)
    if (!editedCard.value) return

    termFieldValue.value = editedCard.value.term
  }

  const actionCaptionData = computed<
    ActionCaptionData | undefined
  >(() => {
    switch (mode.value) {
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
    switch (mode.value) {
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
    switch (mode.value) {
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
    switch (mode.value) {
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
    switch (mode.value) {
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
    switch (mode.value) {
      case 'add-card':
        await cardStore.createCard({
          term: termFieldValue.value,
          category_id: categoryStore.currentCategoryId,
        })
        termFieldValue.value = ''
        break
      case 'edit-card':
        if (editedCard.value) {
          await cardStore.updateCard(editedCard.value.id, {
            term: termFieldValue.value.trim(),
          })
        }
        termFieldValue.value = ''
        mode.value = 'default'
        break
    }
  }

  function onLeadingClick() {
    mode.value = 'default'
  }

  return {
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
