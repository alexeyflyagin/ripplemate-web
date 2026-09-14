<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTermTextField } from './useTermTextField'
import SearchIcon from '~icons/icons-16/search'
import { useTemplateRef, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { TermTextField } from '@/components/ui/TextField/TermTextField'
import { FAB, NavBar } from '@/components/ui/NavBar'
import { useNavBar } from './useNavBar'
import { ref } from 'vue'
import { useLibraryModeStore } from '@/stores/ui/libraryMode'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'

type NAV_STATE = 'default' | 'expanded' | 'collapsed'
const TRANSITION_DURATION = 200

const { t } = useI18n()

const emit = defineEmits<{
  heightChanged: [height: number]
}>()

const libraryMode = useLibraryModeStore()
const { currentWorkspaceId } = useCurrentWorkspace()
const { currentCategoryId } = useCurrentCategory()

const {
  currentView,
  items: navItems,
  setSelectedNavItemId,
  goToView,
} = useNavBar()

const {
  collapsed,
  mode,
  placeholder,
  actionCaptionData,
  leadingButtonData,
  secondaryButtonData,
  sumbitButtonData,
  termFieldValue,
  editCard,
} = useTermTextField(t)

const termTextFieldRef = useTemplateRef<
  InstanceType<typeof TermTextField>
>('termTextFieldRef')
const rootEl = useTemplateRef<HTMLElement>('rootEl')

const currentState = ref<NAV_STATE>('default')

watch(
  [currentView, mode, termFieldValue],
  ([newCurrentView, newMode, newEnteredValue]) => {
    if (newCurrentView === 'library') {
      let newState: NAV_STATE =
        newMode !== 'default' ? 'expanded' : 'default'

      if (newEnteredValue) newState = 'expanded'

      currentState.value = newState
    } else currentState.value = 'collapsed'
  },
  { immediate: true },
)

watch([currentWorkspaceId, currentCategoryId], () => {
  if (currentView.value === 'library') {
    libraryMode.reset()
  }
})

useResizeObserver(rootEl, () => {
  emit(
    'heightChanged',
    rootEl.value?.getBoundingClientRect().height ?? 0,
  )
})

async function onSearch() {
  if (currentView.value !== 'library') {
    await goToView('library')
  }
  libraryMode.openSearch()
  termTextFieldRef.value?.focusInput()
}

async function onEditCard(cardId: string) {
  libraryMode.openEdit(cardId)
  if (currentView.value !== 'library')
    setSelectedNavItemId('library')
  await editCard(cardId)
  termTextFieldRef.value?.focusInput(true)
}

defineExpose({ onEditCard })
</script>

<template>
  <div
    ref="rootEl"
    class="bottom-navigation"
    :class="{
      [`bottom-navigation--${currentState}`]:
        currentState !== 'default',
    }"
    :style="{
      '--transition-duration': `${TRANSITION_DURATION}ms`,
    }"
  >
    <div class="bottom-navigation__content">
      <NavBar
        class="bottom-navigation__nav-bar"
        :nav-items="navItems"
        :selected-id="currentView"
        @update:selected-id="setSelectedNavItemId"
      />
      <TermTextField
        ref="termTextFieldRef"
        class="bottom-navigation__field"
        :placeholder="placeholder"
        :action-caption="actionCaptionData"
        v-model:model-value="termFieldValue"
        :max-length="255"
        :leading-button="leadingButtonData"
        :submit-button="sumbitButtonData"
        :secondary-button="secondaryButtonData"
        :collapsed="collapsed"
      />
      <FAB
        class="bottom-navigation__search-fab"
        :icon="SearchIcon"
        @click="onSearch"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bottom-navigation {
  display: flex;
  padding-bottom: calc(
    var(--space-24) + env(safe-area-inset-bottom)
  );

  &__content {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
    align-items: flex-end;
    justify-content: center;
    margin: 0 auto;
    padding: 0 var(--space-16);
    box-sizing: border-box;
    max-width: var(--max-content-width-680);
  }

  &__field {
    flex: 1 1 0;
    margin-right: var(--space-8);
    transition:
      flex-grow var(--transition-duration)
        var(--ease-emphasized),
      opacity var(--transition-duration)
        var(--ease-emphasized),
      margin var(--transition-duration)
        var(--ease-emphasized);
  }

  &__nav-bar {
    flex: none;
    margin-right: var(--space-8);
    max-width: 200px;
    overflow: hidden;
    transition:
      max-width var(--transition-duration)
        var(--ease-emphasized),
      opacity var(--transition-duration)
        var(--ease-emphasized),
      margin var(--transition-duration)
        var(--ease-emphasized);
  }

  &__search-fab {
    flex: none;
    max-width: 200px;
    transition:
      max-width var(--transition-duration)
        var(--ease-emphasized),
      opacity var(--transition-duration)
        var(--ease-emphasized),
      margin var(--transition-duration)
        var(--ease-emphasized);
  }
}

.bottom-navigation--collapsed {
  & .bottom-navigation__field {
    flex: 0;
    opacity: 0;
    margin: 0;
    pointer-events: none;
  }
}

.bottom-navigation--expanded {
  & .bottom-navigation__field {
    margin: 0;
  }

  & .bottom-navigation__nav-bar,
  & .bottom-navigation__search-fab {
    max-width: 0;
    opacity: 0;
    margin: 0;
    pointer-events: none;
  }
}
</style>
