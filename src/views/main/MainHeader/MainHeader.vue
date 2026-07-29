<script setup lang="ts">
import BaseIconButton from '@/components/Buttons/BaseIconButton.vue'
import SearchIcon from '~icons/icons-16/search'
import MoreIcon from '~icons/icons-16/more'
import WorkspaceDropdown from '@/components/Dropdown/WorkspaceDropdown.vue'
import { useI18n } from 'vue-i18n'
import { useMoreMenu } from './useMoreMenu'
import PlusIcon from '~icons/icons-16/plus'
import { useWorkspaceMenu } from './useWorkspaceMenu'
import BaseTabs from '@/components/Tabs/BaseTabs.vue'
import { useCategoryTabs } from './useCategoryTabs'

const { t } = useI18n()

const { isLoading, currentTabId, tabs, addCategoryClick } =
  useCategoryTabs(t)
const { openMoreMenu } = useMoreMenu(t)
const {
  isMenuOpened,
  currentWorkspaceName,
  openWorkspaceMenu,
} = useWorkspaceMenu(t)
</script>

<template>
  <div>
    <div class="toolbar">
      <WorkspaceDropdown
        :label="currentWorkspaceName"
        v-model:selected="isMenuOpened"
        class="toolbar__workspace-dropdown"
        @click="openWorkspaceMenu"
      />
      <div>
        <BaseIconButton :icon="SearchIcon" />
        <BaseIconButton
          :icon="MoreIcon"
          @click="openMoreMenu"
        />
      </div>
    </div>
    <BaseTabs
      class="category-tabs"
      :isReadyProp="!isLoading"
      :tabs="tabs"
      v-model:active-id="currentTabId"
      :last-button-icon="PlusIcon"
      :style="{ display: 'flex' }"
      @last-button-click="addCategoryClick"
    />
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-16);

  &__workspace-dropdown {
    margin-right: auto;
  }
}

.category-tabs {
  margin: 0 var(--space-16);
}
</style>
