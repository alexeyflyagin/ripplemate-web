<script setup lang="ts">
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
import SearchIcon from '~icons/icons-16/search'
import MoreIcon from '~icons/icons-16/more'
import { WorkspaceDropdown } from '@/components/feature/WorkspaceDropdown'
import { useI18n } from 'vue-i18n'
import { useMoreMenu } from './useMoreMenu'
import PlusIcon from '~icons/icons-16/plus'
import { useWorkspaceMenu } from './useWorkspaceMenu'
import { BaseTabs } from '@/components/ui/Tabs'
import { useCategoryTabs } from './useCategoryTabs'
import { useCategoryMenu } from './useCategoryMenu'
import { onMounted, ref } from 'vue'

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

defineProps<{
  showSearchButton?: boolean
}>()

const EXPANDED_MIN_WIDTH = 680
const isExpanded = ref<boolean>(false)
const containerEl = ref<HTMLElement>()
const containerRO = new ResizeObserver((entries) => {
  const width = entries[0]!.contentRect.width
  const height = entries[0]!.contentRect.height
  isExpanded.value = width >= EXPANDED_MIN_WIDTH
  emit('heightChanged', height)
})

const emit = defineEmits<{
  search: []
  heightChanged: [height: number]
}>()

onMounted(() => {
  if (containerEl.value) {
    containerRO.observe(containerEl.value)
  }
})
</script>

<template>
  <div ref="containerEl">
    <div class="toolbar">
      <WorkspaceDropdown
        class="workspace-dropdown"
        :label="currentWorkspaceName"
        v-model:selected="isMenuOpened"
        @click="openWorkspaceMenu"
      />
      <BaseTabs
        v-if="isExpanded"
        class="category-tabs--built-in"
        :isReadyProp="!isLoading"
        :tabs="tabs"
        :selected-tab-id="selectedId"
        v-model:active-id="currentTabId"
        :last-button-icon="PlusIcon"
        @last-button-click="addCategoryClick"
        @click="onTabClick"
        @contextmenu="onTabContextMenu"
      />
      <div class="action-group">
        <BaseIconButton
          v-if="showSearchButton"
          :icon="SearchIcon"
          @click="emit('search')"
        />
        <BaseIconButton
          :icon="MoreIcon"
          @click="openMoreMenu"
        />
      </div>
    </div>
    <BaseTabs
      v-if="!isExpanded"
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
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-8);
  padding: var(--space-12) var(--space-16);
}

.workspace-dropdown {
  grid-column: 1;
  min-width: 0;
  overflow: hidden;
  justify-self: start;
  max-width: 100%;
}

.action-group {
  grid-column: 3;
  justify-self: end;
}

.category-tabs {
  @include elevation-3;
  grid-column: 2;
  margin: 0 var(--space-16);

  &--built-in {
    @include elevation-3;
    justify-self: center;
    max-width: var(--max-content-width-400);
  }
}
</style>
