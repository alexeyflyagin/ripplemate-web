<script setup lang="ts">
import HomeView from '../HomeView/HomeView.vue'
import FlowView from '../FlowView/FlowView.vue'
import { useNavBar } from './useNavBar.ts'
import MainHeader from '../MainHeader/MainHeader.vue'
import NavBarGroup from './NavBarGroup.vue'
import TermTextField from '@/components/TextFields/TermTextField.vue'
import { onMounted, onUnmounted, ref } from 'vue'

import { useI18n } from 'vue-i18n'
import { useTermTextField } from './useTermTextField.ts'
import { nextPaint } from '@/utils/nextPaint.ts'
import { useMainViewStates } from './useMainViewState.ts'
import { useKeyboardObserver } from '@/composables/useKeyboardObserver.ts'
import { useBottomContainer } from './useBottomContainer.ts'

const { t } = useI18n()

const {
  isKeyboardOpen,
  addKeyboardObserver,
  removeKeyboardObserver,
} = useKeyboardObserver()

const {
  bottomContainerEl,
  bottomContainerHeight,
  observeBottomContainerHeight,
} = useBottomContainer()

const termTextFieldRef =
  ref<InstanceType<typeof TermTextField>>()

const { currentView, mode } = useMainViewStates()

const {
  items: navItems,
  selectedIndex: selectedViewIndex,
  selectedNavItemId,
  setSelectedNavItemId,
} = useNavBar()

const {
  placeholder,
  actionCaptionData,
  leadingButtonData,
  onSubmitClick,
  secondaryButtonData,
  sumbitButtonData,
  termFieldValue,
} = useTermTextField(t, mode)

async function onAddClick() {
  mode.value = 'add-card'
  setSelectedNavItemId('home')
  await nextPaint()
  termTextFieldRef.value?.focusInput()
}

async function onSearch() {
  mode.value = 'search'
  setSelectedNavItemId('home')
  await nextPaint()
  termTextFieldRef.value?.focusInput()
}

onMounted(() => {
  addKeyboardObserver()
  observeBottomContainerHeight()
})

onUnmounted(() => {
  removeKeyboardObserver()
})
</script>

<template>
  <div
    class="main-view"
    :style="{
      '--bottom-container-height':
        bottomContainerHeight + 'px',
    }"
  >
    <MainHeader
      class="main-header"
      :show-search-button="mode !== 'search'"
      @search="onSearch"
    />
    <HomeView
      class="home-view"
      v-if="selectedNavItemId === 'home'"
    />
    <FlowView
      class="flow-view"
      v-if="selectedNavItemId === 'flow'"
    />
    <div class="bottom-container" ref="bottomContainerEl">
      <div class="bottom-container__content">
        <NavBarGroup
          v-if="mode === 'default'"
          :nab-bar-items="navItems"
          v-model:selected-index="selectedViewIndex"
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
          @leading-click="
            ((mode = 'default'), (termFieldValue = ''))
          "
        />
        <div v-if="isKeyboardOpen" class="scrim" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;

.main-view {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-header {
  flex-shrink: 0;
  z-index: 1;
}

.home-view,
.flow-view {
  flex: 1;
  min-height: 0;
}

.term-text-field {
  @include elevation-3;
  align-self: flex-end;
  flex-grow: 1;
}

.scrim {
  position: fixed;
  width: 100dvw;
  height: 100dvh;
  inset: 0;
  background-color: black;
  opacity: var(--opacity-4);
  z-index: -1;
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

  &__content {
    flex: 1;
    max-width: var(--max-content-width-680);
    padding: 0 var(--space-16);
    box-sizing: border-box;
  }
}
</style>
