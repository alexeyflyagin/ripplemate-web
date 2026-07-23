<script setup lang="ts">
import CategoryTabs from '@/components/Tabs/CategoryTabs/CategoryTabs.vue'
import type {} from '@/components/ContextMenu/ContextMenu.types'
import BaseIconButton from '@/components/Buttons/BaseIconButton.vue'
import AddFolderIcon from '~icons/icons-16/add-folder'
import MoreIcon from '~icons/icons-16/more'
import WorkspaceDropdown from '@/components/Dropdown/WorkspaceDropdown.vue'
</script>

<template>
  <div>
    <div class="toolbar">
      <BaseIconButton :icon="AddFolderIcon" />
      <WorkspaceDropdown
        label="English"
        class="toolbar__workspace-dropdown"
      />
      <BaseIconButton :icon="MoreIcon" />
    </div>
    <CategoryTabs class="tabs" :tabs="[]" />
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
