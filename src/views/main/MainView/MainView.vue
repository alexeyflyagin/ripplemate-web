<script setup lang="ts">
import { useNavBar } from './useNavBar.ts'
import MainHeader from '@/views/main/MainHeader/MainHeader.vue'
import { NavBar, FAB } from '@/components/ui/NavBar'
import SearchIcon from '~icons/icons-16/search'
import { TermTextField } from '@/components/ui/TextField/TermTextField'
import { computed, ref, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import { useTermTextField } from './useTermTextField.ts'
import { nextPaint } from '@/utils/nextPaint.ts'
import { useBottomContainer } from './useBottomContainer.ts'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useCategoryStore } from '@/stores/domain/category'
import { useLibraryModeStore } from '@/stores/ui/libraryMode'

const { t } = useI18n()

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

const hasText = computed(
  () => !!termFieldValue.value.trim(),
)

const showControls = computed(
  () => mode.value === 'default',
)

const isFlow = computed(() => currentView.value === 'flow')

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

async function onSearch() {
  if (currentView.value !== 'library') {
    await goToView('library')
  }
  libraryMode.openSearch()
  await nextPaint()
  termTextFieldRef.value?.focusInput()
}

async function onEditCard(cardId: string) {
  libraryMode.openEdit(cardId)
  if (currentView.value !== 'library')
    setSelectedNavItemId('library')
  await editCard(cardId)
  await nextPaint()
  termTextFieldRef.value?.focusInput(true)
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
      @height-changed="(h) => (mainHeaderHeight = h)"
    />
    <RouterView
      :header-height="mainHeaderHeight"
      @edit-card="onEditCard"
    />
    <div class="bottom-container" ref="bottomContainerEl">
      <div class="bottom-container__content">
        <div
          class="composer"
          :class="{ 'composer--field-collapsed': isFlow }"
        >
          <NavBar
            v-if="showControls"
            class="composer__nav-bar"
            :class="{
              'composer__control--collapsed': hasText,
            }"
            :nav-items="navItems"
            :selected-id="currentView"
            @update:selected-id="setSelectedNavItemId"
          />
          <TermTextField
            ref="termTextFieldRef"
            class="composer__field"
            :class="{
              'composer__field--collapsed': isFlow,
              'composer__field--nowrap': !hasText,
            }"
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
          <FAB
            v-if="showControls"
            class="composer__search"
            :class="{
              'composer__control--collapsed': hasText,
            }"
            :icon="SearchIcon"
            @click="onSearch"
          />
        </div>
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
  z-index: 10;
}

:deep(.home-view),
:deep(.flow-view) {
  flex: 1;
  min-height: 0;
}

.composer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  min-height: 54px;
}

.composer__nav-bar,
.composer__search {
  flex: none;
  align-self: center;
  overflow: hidden;
  max-width: 240px;
  opacity: 1;
  pointer-events: auto;
  transition:
    max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    margin 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.composer__nav-bar {
  margin-right: var(--space-8);
}

.composer__search {
  margin-left: var(--space-8);
}

.composer--field-collapsed .composer__search {
  margin-left: 0;
}

.composer__control--collapsed {
  max-width: 0;
  margin-right: 0;
  margin-left: 0;
  opacity: 0;
  pointer-events: none;
}

.composer__field {
  @include elevation-1;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  align-self: center;
  pointer-events: auto;
  transition:
    flex-grow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    margin 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.composer__field--nowrap :deep(.text-area) {
  white-space: nowrap;
  overflow: hidden;
}
.composer__field--collapsed {
  flex-grow: 0;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

.bottom-container {
  position: absolute;
  display: flex;
  right: 0;
  left: 0;
  bottom: 0;
  justify-content: center;
  padding: 0 0
    calc(var(--space-24) + env(safe-area-inset-bottom));
  z-index: 10;
  pointer-events: none;

  &__content {
    flex: 1;
    min-width: 0;
    max-width: var(--max-content-width-680);
    padding: 0 var(--space-16);
    box-sizing: border-box;
  }
}
</style>
