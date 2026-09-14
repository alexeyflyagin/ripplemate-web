<script setup lang="ts">
import { WorkspaceDropdown } from '@/components/feature/WorkspaceDropdown'
import MainSidebarAppBar from './MainSidebarAppBar.vue'
import { useWorkspaceMenu } from './useWorkspaceMenu.ts'
import { useI18n } from 'vue-i18n'
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
import MoreIcon from '~icons/icons-16/more'
import ProfileIcon from '~icons/icons-16/profile'
import { BaseButton } from '@/components/ui/Button/BaseButton/index.ts'
import { useProfileMenu } from './useProfileMenu.ts'
import { useWorkspaceMoreMenu } from './useWorkspaceMoreMenu.ts'
import { useAboutMenu } from './useAboutMenu.ts'
import InfoCircleIcon from '~icons/icons-16/info-circle'
import AddFolderIcon from '~icons/icons-16/add-folder'
import CategoryItem from './CategoryItem.vue'
import { useCategories } from './useCategories.ts'
import { ALL_CATEGORY_ID } from './factories.ts'
import { ref, watch } from 'vue'

const { t } = useI18n()

const emit = defineEmits<{
  categorySelected: []
}>()

const {
  currentWorkspaceName,
  isMenuOpened,
  openWorkspaceMenu,
} = useWorkspaceMenu(t)

const {
  selectedId,
  categories,
  currentCategoryId,
  onTabContextMenu,
  selectCategory,
  addCategoryClick,
} = useCategories(t)

const { userName, openMenu } = useProfileMenu(t)

const { openMenu: openWorkspaceMoreMenu } =
  useWorkspaceMoreMenu(t)

const { openMenu: openAboutMenu } = useAboutMenu(t)

const categoryEls = ref<Map<string, HTMLElement>>(new Map())

watch(
  currentCategoryId,
  (v) => {
    categoryEls.value.get(v)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  },
  { flush: 'post' },
)

function setCategoryRef(
  id: string,
  el: HTMLElement | undefined,
) {
  if (el) {
    categoryEls.value.set(id, el)
  } else {
    categoryEls.value.delete(id)
  }
}

function onCategory(id: string) {
  selectCategory(id)
  emit('categorySelected')
}
</script>

<template>
  <div class="main-sidebar">
    <MainSidebarAppBar />
    <div class="main-sidebar__content">
      <div class="main-sidebar__workpsace">
        <WorkspaceDropdown
          class="main-sidebar__workspace-dropwdown"
          :label="currentWorkspaceName"
          v-model:selected="isMenuOpened"
          @click="openWorkspaceMenu"
        />
        <BaseIconButton
          class="main-sidebar__add-category-button"
          :icon="AddFolderIcon"
          @click="addCategoryClick"
        />
        <BaseIconButton
          class="main-sidebar__workspace-more-button"
          :icon="MoreIcon"
          @click="openWorkspaceMoreMenu"
        />
      </div>
    </div>
    <div class="main-sidebar__categories">
      <CategoryItem
        v-for="c in categories"
        :ref="(el: any) => setCategoryRef(c.id, el?.$el)"
        v-bind:key="c.id"
        v-bind="c"
        class="main-sidebar__category-item"
        :selected="c.id === selectedId"
        :active="c.id === currentCategoryId"
        :more="c.id !== ALL_CATEGORY_ID"
        @click="() => onCategory(c.id)"
        @contextmenu="
          (event: MouseEvent | KeyboardEvent) =>
            onTabContextMenu(event, c.id)
        "
      />
    </div>
    <footer class="main-sidebar__footer">
      <BaseButton
        :icon="ProfileIcon"
        :label="userName"
        @click="openMenu"
      />
      <BaseIconButton
        class="main-sidebar__about-button"
        :icon="InfoCircleIcon"
        @click="openAboutMenu"
      />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.main-sidebar {
  display: flex;
  flex-direction: column;
  min-width: 300px;

  &__workpsace {
    display: flex;
    padding: 0 var(--space-12) var(--space-8);
  }

  &__workspace-dropwdown {
    margin-right: var(--space-8);
  }

  &__add-category-button {
    margin-left: auto;
    margin-right: var(--space-2);
  }

  &__categories {
    @include custom-scrollbar;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
  }

  &__category-item {
    padding: 0 var(--space-12) var(--space-2);
  }

  &__footer {
    display: flex;
    padding: var(--space-12) var(--space-12)
      calc(var(--space-12) + env(safe-area-inset-bottom))
      var(--space-12);
  }

  &__about-button {
    margin-left: auto;
    opacity: var(--opacity-60);
  }
}
</style>
