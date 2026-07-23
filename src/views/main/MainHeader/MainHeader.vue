<script setup lang="ts">
import CategoryTabs from '@/components/Tabs/CategoryTabs/CategoryTabs.vue'
import type { MenuItemData } from '@/components/ContextMenu/ContextMenu.types'
import BaseIconButton from '@/components/Buttons/BaseIconButton.vue'
import AddFolderIcon from '~icons/icons-16/add-folder'
import MoreIcon from '~icons/icons-16/more'
import WorkspaceDropdown from '@/components/Dropdown/WorkspaceDropdown.vue'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '@/stores/category'
import { useCategoryTabs } from './useTabs'
import { getRect } from '@/utils/getRectByMouseEvent'
import { useContextMenuStore } from '@/stores/contextMenu'
import { createHomeMoreMenu } from '@/menu/HomeMore'
import { FONT_ICONS, THEME_ICONS } from './constants'
import { resolveTheme } from '@/composables/useTheme'
import { useAccountStore } from '@/stores/account'
import { useWorkspaceStore } from '@/stores/workspace'
import { computed } from 'vue'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()
const accountStore = useAccountStore()
const workspaceStore = useWorkspaceStore()
const settingsStore = useSettingsStore()
const categoryStore = useCategoryStore()
const menuStore = useContextMenuStore()

const { tabs, currentTab } = useCategoryTabs(t)

async function handleMoreClick(event: MouseEvent) {
  const rect = getRect(event)

  const items = computed(() =>
    createHomeMoreMenu(t, {
      font:
        settingsStore.settings?.font ??
        t('general.state.loading'),
      fontIcon: settingsStore.settings
        ? FONT_ICONS[settingsStore.settings?.font]
        : FONT_ICONS['sans-serif'],
      theme: settingsStore.settings
        ? t(`general.theme.${settingsStore.settings.theme}`)
        : t('general.state.loading'),
      language: settingsStore.settings
        ? t(
            `general.lang.${settingsStore.settings.language}`,
          )
        : t('general.state.loading'),
      themeIcon: settingsStore.settings
        ? THEME_ICONS[
            resolveTheme(settingsStore.settings.theme)
          ]
        : THEME_ICONS['light'],
      userDisplayName: accountStore.account
        ? accountStore.account.display_name
        : t('general.state.loading'),
      workspaceName: workspaceStore.currentWorkspace
        ? workspaceStore.currentWorkspace.name
        : t('general.state.loading'),
    }),
  )

  async function onItemClick(item: MenuItemData) {
    switch (item.id) {
      case 'font':
        await settingsStore.nextFont()
        return false
      case 'language':
        await settingsStore.nextLanguage()
        return false
      case 'theme':
        await settingsStore.nextTheme()
        return false
      case 'logout':
        await authStore.logout()
        router.push({ name: 'login' })
        break
    }
    return true
  }

  menuStore.open({
    posX: rect.right,
    posY: rect.top,
    menuItems: items,
    menuAnchor: 'right-top',
    handler: onItemClick,
  })
}

async function handleThemeClick() {
  await settingsStore.nextLanguage()
}

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
        :label="
          settingsStore.settings
            ? t(
                `general.lang.${settingsStore.settings.language}`,
              )
            : t('general.state.loading')
        "
        class="toolbar__workspace-dropdown"
        @click="handleThemeClick"
      />
      <BaseIconButton
        :icon="MoreIcon"
        @click="handleMoreClick"
      />
    </div>
    <CategoryTabs
      class="tabs"
      :tabs="tabs"
      v-model:selected-index="currentTab"
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
