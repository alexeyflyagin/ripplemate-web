<script setup lang="ts">
import CategoryTabs from '@/components/Tabs/CategoryTabs/CategoryTabs.vue'
import BaseIconButton from '@/components/Buttons/BaseIconButton.vue'
import AddFolderIcon from '~icons/icons-16/add-folder'
import MoreIcon from '~icons/icons-16/more'
import WorkspaceDropdown from '@/components/Dropdown/WorkspaceDropdown.vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '@/stores/category'
import { useCategoryTabs } from './useTabs'
import { useMoreMenu } from './useMoreMenu'
import { useWorkspaceMenu } from './useWorkspaceMenu'
import { useCategoryMenu } from './useCategoryMenu'

const { t } = useI18n()

const categoryStore = useCategoryStore()

const { tabs, currentTab } = useCategoryTabs(t)
const { openMoreMenu } = useMoreMenu(t)
const {
  isMenuOpened,
  currentWorkspaceName,
  openWorkspaceMenu,
} = useWorkspaceMenu(t)
const { openCategoryMenu } = useCategoryMenu(t)

async function onAddCategoryClick() {
  if (!categoryStore.categories) return

  await categoryStore.createCategory({
    name: `New Category ${categoryStore.categories.length + 1}`,
  })
}
</script>

<template>
  <div>
    <div class="toolbar">
      <BaseIconButton
        :icon="AddFolderIcon"
        @click="onAddCategoryClick"
      />
      <WorkspaceDropdown
        :label="currentWorkspaceName"
        v-model:selected="isMenuOpened"
        class="toolbar__workspace-dropdown"
        @click="openWorkspaceMenu"
      />
      <BaseIconButton
        :icon="MoreIcon"
        @click="openMoreMenu"
      />
    </div>
    <CategoryTabs
      class="tabs"
      :tabs="tabs"
      v-model:selected-index="currentTab"
      @contextmenu="openCategoryMenu"
    />
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  gap: var(--space-8);
  padding: var(--space-12) var(--space-16);

  &__workspace-dropdown {
    margin: auto;
  }
}

.tabs {
  margin: 0, var(--space-16);
}
</style>
