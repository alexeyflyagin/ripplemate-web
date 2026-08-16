<script setup lang="ts">
import HomeView from '../HomeView/HomeView.vue'
import FlowView from '../FlowView/FlowView.vue'
import { useNavBar } from './useNavBar.ts'
import MainHeader from '../MainHeader/MainHeader.vue'
import NavBarGroup from './NavBarGroup.vue'
import TermTextField from '@/components/TextFields/TermTextField.vue'
import PlusIcon from '~icons/icons-16/plus'
import CaretLeftIcon from '~icons/icons-16/caret-left'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { nextPaint } from '@/utils/nextPaint.ts'
import { useCardStore } from '@/stores/card.ts'
import { useCategoryStore } from '@/stores/category.ts'

let bottomContainerResizeObserver: ResizeObserver | null =
  null
const bottomContainer = ref<HTMLElement>()
const bottomContainerHeight = ref<number>(0)
const isKeyboardOpen = ref(false)

const { items, selectedIndex, selectedNavItemId } =
  useNavBar()

onMounted(() => {
  bottomContainerResizeObserver = new ResizeObserver(() => {
    bottomContainerHeight.value =
      document
        .querySelector('.bottom-container')
        ?.getBoundingClientRect().height ?? 0
  })

  if (bottomContainer.value) {
    bottomContainerResizeObserver.observe(
      bottomContainer.value,
    )
  }
})

const cardStore = useCardStore()
const categoryStore = useCategoryStore()

async function onAddClick() {
  viewState.value = 'add-card'
  await nextPaint()
  termTextFieldRef.value?.focusInput()
}

async function onSubmitClick() {
  await cardStore.createCard({
    term: termFieldValue.value,
    category_id: categoryStore.currentCategoryId,
  })
  termFieldValue.value = ''
}

const termTextFieldRef =
  ref<InstanceType<typeof TermTextField>>()
type MainViewState =
  | 'default'
  | 'add-card'
  | 'edit-card'
  | 'search'
const termFieldValue = ref<string>('')
const viewState = ref<MainViewState>('default')

function onViewportResize() {
  const vv = window.visualViewport
  if (!vv) return
  isKeyboardOpen.value = window.innerHeight - vv.height < 0
}

onMounted(() => {
  window.visualViewport?.addEventListener(
    'resize',
    onViewportResize,
  )
})
onUnmounted(() => {
  window.visualViewport?.removeEventListener(
    'resize',
    onViewportResize,
  )
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
    <MainHeader class="main-header" />
    <HomeView
      class="home-view"
      v-if="selectedNavItemId === 'home'"
    />
    <FlowView
      class="flow-view"
      v-if="selectedNavItemId === 'flow'"
    />
    <div class="bottom-container" ref="bottomContainer">
      <div class="bottom-container__content">
        <NavBarGroup
          v-if="viewState === 'default'"
          :nab-bar-items="items"
          v-model:selected-index="selectedIndex"
          @on-add-click="onAddClick"
        />
        <TermTextField
          v-else
          ref="termTextFieldRef"
          class="term-text-field"
          placeholder="Term"
          v-model:model-value="termFieldValue"
          :max-length="255"
          :leading-button="{
            icon: CaretLeftIcon,
          }"
          :submit-button="{
            icon: PlusIcon,
            color: 'accent',
            disabled: !termFieldValue.trim(),
          }"
          @submit-click="onSubmitClick"
          @leading-click="viewState = 'default'"
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
  opacity: 0.2;
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
