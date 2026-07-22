<script setup lang="ts">
import CategoryTabs from '@/components/Tabs/CategoryTabs/CategoryTabs.vue'
import { type Tab } from '@/components/Tabs/CategoryTabs/CategoryTab.types'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue'
import { createCategoryMenu } from '@/menu/Category'
import type {
  MenuItemData,
  MenuPos,
} from '@/components/ContextMenu/ContextMenu.types'
import BaseIconButton from '@/components/Buttons/BaseIconButton.vue'
import AddFolderIcon from '~icons/icons-16/add-folder'
import MoreIcon from '~icons/icons-16/more'
import DayIcon from '~icons/icons-16/day'
import SerifIcon from '~icons/icons-16/serif'
import TickIcon from '~icons/icons-16/tick'
import PlusIcon from '~icons/icons-16/plus'
import { createHomeMoreMenu } from '@/menu/HomeMore'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { applyTheme } from '@/composables/useTheme'
import WorkspaceDropdown from '@/components/Dropdown/WorkspaceDropdown.vue'

const { t } = useI18n()

const authStore = useAuthStore()
const router = useRouter()

const menuPos = ref<MenuPos>({ x: 0, y: 0 })
const menuPayload = ref()
const menuItems = ref<MenuItemData[]>([])
const isMenuOpened = ref<boolean>(false)
const onMenuClickAction = ref()

const workspaceSelected = ref<boolean>(false)

watch(workspaceSelected, (value) => {
  if (!value) isMenuOpened.value = false
})

const tabs = ref<Tab[]>([
  { value: -1, label: t('general.label.all') },
  { value: 1, label: 'Words', clickable: true },
])

function onTabClick(event: MouseEvent, tab: Tab) {
  const rect = (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect()
  menuPos.value.x = rect.left + rect.width / 2
  menuPos.value.y = rect.bottom + 4
  menuPos.value.anchor = 'center-top'
  menuItems.value = createCategoryMenu(t, tab.label)
  isMenuOpened.value = true
}

function onMoreClick(event: MouseEvent) {
  const rect = (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect()
  menuPos.value.x = rect.right
  menuPos.value.y = rect.top
  menuPos.value.anchor = 'right-top'
  menuItems.value = createHomeMoreMenu(t, {
    userDisplayName: 'Ella',
    workspaceName: 'English',
    font: 'Serif',
    theme: 'Light',
    fontIcon: SerifIcon,
    themeIcon: DayIcon,
  })
  function onMenuClick(item: MenuItemData) {
    switch (item.id) {
      case 'logout':
        authStore.logout()
        router.push({ name: 'login' })
        break
      case 'theme':
        // TODO
        applyTheme('dark')
        break
    }
  }

  onMenuClickAction.value = onMenuClick
  isMenuOpened.value = true
}

function onWorkspaceClick(event: MouseEvent) {
  const rect = (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect()
  menuPos.value.x = rect.left + rect.width / 2
  menuPos.value.y = rect.bottom + 4
  menuPos.value.anchor = 'center-top'
  menuItems.value = [
    {
      id: '0',
      label: 'English',
      icon: TickIcon,
      selected: true,
    },
    {
      id: '1',
      label: 'Work',
    },
    {
      id: 'addWorkspace',
      label: t('general.action.addWorkspace'),
      icon: PlusIcon,
      showDivider: true,
    },
  ]
  isMenuOpened.value = true

  const stop = watch(isMenuOpened, (value) => {
    if (value) return
    ;((workspaceSelected.value = value), stop())
  })
}
</script>

<template>
  <div>
    <div class="toolbar">
      <BaseIconButton :icon="AddFolderIcon" />
      <WorkspaceDropdown
        label="English"
        class="toolbar__workspace-dropdown"
        v-model:selected="workspaceSelected"
        @click="onWorkspaceClick"
      />
      <BaseIconButton
        :icon="MoreIcon"
        @click="onMoreClick"
      />
    </div>
    <CategoryTabs
      class="tabs"
      :tabs="tabs"
      @contextmenu="onTabClick"
    />
  </div>

  <ContextMenu
    v-bind="menuPos"
    v-model:items="menuItems"
    v-model:is-opened="isMenuOpened"
    :payload="menuPayload"
    @click-item="onMenuClickAction"
  />
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
