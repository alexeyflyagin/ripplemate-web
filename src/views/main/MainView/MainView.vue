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
import { useBottomContainer } from './useBottomContainer.ts'
import { useKeyboardObserver } from '@/composables/useKeyboardObserver.ts'

const { t } = useI18n()

const { isKeyboardOpen } = useKeyboardObserver()

const termTextFieldRef =
  ref<InstanceType<typeof TermTextField>>()
const bottomContainerEl = ref<HTMLElement>()
const mainHeaderHeight = ref<number>(0)

const { bottomContainerHeight } = useBottomContainer(
  bottomContainerEl,
)

const { currentView, mode } = useMainViewStates()

const { items: navItems, setSelectedNavItemId } =
  useNavBar(currentView)

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
    <HomeView
      class="home-view"
      v-if="currentView === 'home'"
    />
    <FlowView
      class="flow-view"
      v-if="currentView === 'flow'"
    />
    <div class="bottom-container" ref="bottomContainerEl">
      <div class="bottom-container__content">
        <NavBarGroup
          v-if="mode === 'default'"
          :nab-bar-items="navItems"
          v-model:selected-id="currentView"
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

.home-view,
.flow-view {
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
