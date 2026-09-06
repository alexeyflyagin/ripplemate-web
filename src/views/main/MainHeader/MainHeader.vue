<script setup lang="ts">
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
import MoreIcon from '~icons/icons-16/more'
import { WorkspaceDropdown } from '@/components/feature/WorkspaceDropdown'
import { useI18n } from 'vue-i18n'
import { useMoreMenu } from './useMoreMenu'
import PlusIcon from '~icons/icons-16/plus'
import { useWorkspaceMenu } from './useWorkspaceMenu'
import { BaseTabs } from '@/components/ui/Tabs'
import { useCategoryTabs } from './useCategoryTabs'
import { useCategoryMenu } from './useCategoryMenu'
import { ref, useTemplateRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const { t } = useI18n()

const { isLoading, currentTabId, tabs, addCategoryClick } =
  useCategoryTabs(t)

const { selectedId, onTabClick, onTabContextMenu } =
  useCategoryMenu(t)

const { openMoreMenu } = useMoreMenu(t)

const {
  isMenuOpened,
  currentWorkspaceName,
  openWorkspaceMenu,
} = useWorkspaceMenu(t)

const EXPANDED_MIN_WIDTH = 680
const isExpanded = ref<boolean>(false)

const slotEl = useTemplateRef<HTMLElement>('slot')
const slotTop = ref<number>(0)
const slotLeft = ref<number>(0)
const slotWidth = ref<number>(0)
useResizeObserver(slotEl, () => {})

const containerEl = useTemplateRef<HTMLElement>('container')
useResizeObserver(containerEl, (entries) => {
  const width = entries[0]!.contentRect.width
  const height = entries[0]!.contentRect.height
  isExpanded.value = width >= EXPANDED_MIN_WIDTH
  emit('heightChanged', height)

  if (!slotEl.value) return
  slotTop.value = slotEl.value.getBoundingClientRect().top
  slotLeft.value = slotEl.value.getBoundingClientRect().left
  slotWidth.value =
    slotEl.value.getBoundingClientRect().width
})

const emit = defineEmits<{
  heightChanged: [height: number]
}>()
</script>

<template>
  <div
    ref="container"
    class="container"
    :class="{ 'container--expanded': isExpanded }"
  >
    <div class="toolbar">
      <WorkspaceDropdown
        class="workspace-dropdown"
        :label="currentWorkspaceName"
        v-model:selected="isMenuOpened"
        @click="openWorkspaceMenu"
      />
      <div class="slot-for-tabs" ref="slot" />
      <div class="action-group">
        <BaseIconButton
          :icon="MoreIcon"
          @click="openMoreMenu"
        />
      </div>
    </div>
    <div
      class="category-tabs__container"
      :class="{
        'category-tabs__container--floating': isExpanded,
      }"
      :style="{
        '--top': `${slotTop}px`,
        '--left': `${slotLeft}px`,
        '--width': `${slotWidth}px`,
      }"
    >
      <BaseTabs
        class="category-tabs"
        :isReadyProp="!isLoading"
        :tabs="tabs"
        :selected-tab-id="selectedId"
        v-model:active-id="currentTabId"
        :last-button-icon="PlusIcon"
        @last-button-click="addCategoryClick"
        @click="onTabClick"
        @contextmenu="onTabContextMenu"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/blur' as *;

.container {
  @include background-blur-20;
  background-color: var(--bg-60);
  padding-top: env(safe-area-inset-top);

  &--expanded {
    border-bottom: var(--stroke-subtle) solid
      var(--border-muted);
  }
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--space-8);
  padding: calc(var(--space-12)) var(--space-16);
}

.workspace-dropdown {
  grid-column: 1;
  min-width: max-content;
  overflow: hidden;
  justify-self: start;
  max-width: 100%;
}

.action-group {
  grid-column: 3;
  justify-self: end;
  min-width: max-content;
}

.category-tabs {
  @include elevation-1;
}

.category-tabs__container {
  padding: 0 var(--space-16);

  &--floating {
    position: absolute;
    display: flex;
    justify-content: center;
    top: var(--top);
    left: var(--left);
    width: var(--width);
    padding: 0;
  }
}

.slot-for-tabs {
  grid-column: 2;
  width: 100%;
  max-width: var(--max-content-width-400);
  min-height: 0;
  justify-self: center;
}
</style>
