<script setup lang="ts">
import { useNavBar } from './useNavBar.ts'
import MainHeader from '@/views/main/MainHeader/MainHeader.vue'
import NavBarGroup from './NavBarGroup.vue'
import { TermTextField } from '@/components/ui/TextField/TermTextField'
import { ref, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import { useTermTextField } from './useTermTextField.ts'
import { nextPaint } from '@/utils/nextPaint.ts'
import { useBottomContainer } from './useBottomContainer.ts'
import { useKeyboardObserver } from '@/composables/useKeyboardObserver.ts'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useCategoryStore } from '@/stores/domain/category'
import { useLibraryModeStore } from '@/stores/ui/libraryMode'

const { t } = useI18n()

const { isKeyboardOpen } = useKeyboardObserver()

const termTextFieldRef =
  ref<InstanceType<typeof TermTextField>>()
const bottomContainerEl = ref<HTMLElement>()
const mainHeaderHeight = ref<number>(0)

const { bottomContainerHeight } = useBottomContainer(
  bottomContainerEl,
)

const libraryMode = useLibraryModeStore()
const {
  currentView,
  goToView,
  items: navItems,
  setSelectedNavItemId,
} = useNavBar()

const {
  mode,
  placeholder,
  actionCaptionData,
  leadingButtonData,
  onSubmitClick,
  secondaryButtonData,
  sumbitButtonData,
  termFieldValue,
  editCard,
  onLeadingClick,
} = useTermTextField(t)

const { currentWorkspaceId } = useCurrentWorkspace()
const categoryStore = useCategoryStore()

watch(
  currentWorkspaceId,
  (id) => {
    if (id) categoryStore.loadCategories(id)
    else categoryStore.clearCategories()
  },
  { immediate: true },
)

async function onAddClick() {
  libraryMode.openAdd()
  if (currentView.value !== 'library') setSelectedNavItemId('library')
  await nextPaint()
  termTextFieldRef.value?.focusInput()
}

async function onSearch() {
  if (currentView.value !== 'library') {
    await goToView('library')
  }
  libraryMode.openSearch()
  await nextPaint()
  termTextFieldRef.value?.focusInput()
}

async function onEditCard(cardId: number) {
  libraryMode.openEdit(cardId)
  if (currentView.value !== 'library') setSelectedNavItemId('library')
  await editCard(cardId)
  await nextPaint()
  termTextFieldRef.value?.focusInput()
}
</script>

<template>
  <div
    class="main-view"
    :style="{
      '--bottom-container-height':
        bottomContainerHeight + 'px',
      '--main-header-height': mainHeaderHeight + 'px',
    }"
  >
    <MainHeader
      class="main-header"
      :show-search-button="mode !== 'search'"
      @search="onSearch"
      @height-changed="(h) => (mainHeaderHeight = h)"
    />
    <RouterView @edit-card="onEditCard" />
    <div class="bottom-container" ref="bottomContainerEl">
      <div class="bottom-container__content">
        <NavBarGroup
          v-if="mode === 'default'"
          :nab-bar-items="navItems"
          :selected-id="currentView"
          @update:selected-id="setSelectedNavItemId"
          @on-add-click="onAddClick"
        />
        <TermTextField
          v-else
          ref="termTextFieldRef"
          class="term-text-field"
          :placeholder="placeholder"
          :action-caption="actionCaptionData"
          v-model:model-value="termFieldValue"
          :max-length="255"
          :leading-button="leadingButtonData"
          :submit-button="sumbitButtonData"
          :secondary-button="secondaryButtonData"
          @submit-click="onSubmitClick"
          @secondary-click="termFieldValue = ''"
          @leading-click="onLeadingClick"
        />
        <div v-if="isKeyboardOpen" class="scrim" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/shadows' as *;

.main-view {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  flex-shrink: 0;
  z-index: 1;
}

:deep(.home-view),
:deep(.flow-view) {
  flex: 1;
  min-height: 0;
}

.term-text-field {
  @include elevation-3;
  align-self: flex-end;
  flex-grow: 1;
  pointer-events: auto;
}

.scrim {
  position: fixed;
  width: 100dvw;
  height: 100dvh;
  inset: 0;
  background-color: black;
  opacity: var(--opacity-4);
  z-index: -1;
  pointer-events: auto;
}

.bottom-container {
  position: absolute;
  display: flex;
  right: 0;
  left: 0;
  bottom: 0;
  justify-content: center;
  padding: var(--space-24) 0;
  z-index: 1;
  pointer-events: none;

  &__content {
    flex: 1;
    max-width: var(--max-content-width-680);
    padding: 0 var(--space-16);
    box-sizing: border-box;
  }
}
</style>
