import type { RoundIconButtonData } from '@/components/Buttons/RoundIconButton'
import type { ActionCaptionData } from '@/components/TextFields/TermTextField.types'
import { useCardStore } from '@/stores/card'
import { useCategoryStore } from '@/stores/category'
import { computed, ref, watch, type Ref } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import SearchIcon from '~icons/icons-12/search'
import CircleCloseIcon from '~icons/icons-16/circle-close'
import PlusIcon from '~icons/icons-16/plus'
import CaretLeftIcon from '~icons/icons-16/caret-left'
import type { NavBarMode } from './useMainViewState'

export function useTermTextField(
  t: ComposerTranslation,
  mode: Ref<NavBarMode>,
) {
  const cardStore = useCardStore()
  const categoryStore = useCategoryStore()

  const termFieldValue = ref<string>('')

  watch(termFieldValue, (v) => {
    if (mode.value === 'search')
      cardStore.setSearch(v.trim())
  })

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
      case 'add-card':
        return {
          icon: CaretLeftIcon,
        }
      case 'search':
        return {
          icon: CaretLeftIcon,
        }
      default:
        return undefined
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
    }
  }

  return {
    termFieldValue,
    actionCaptionData,
    placeholder,
    leadingButtonData,
    sumbitButtonData,
    secondaryButtonData,
    onSubmitClick,
  }
}
