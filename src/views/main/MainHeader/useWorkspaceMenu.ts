import type { MenuItemData } from '@/components/ContextMenu/ContextMenu.types'
import { useWorkspaceStore } from '@/stores/workspace'
import { getRect } from '@/utils/getRectByMouseEvent'
import { computed } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'
import { createAddWorkspaceMenuItem } from './factories'
import TickIcon from '~icons/icons-16/tick'
import { useContextMenuStore } from '@/stores/contextMenu'

export function useWorkspaceMenu(t: ComposerTranslation) {
  const workspaceStore = useWorkspaceStore()
  const menuStore = useContextMenuStore()

  const currentWorkspaceName = computed(
    () =>
      workspaceStore.currentWorkspace?.name ??
      t('general.action.selectWorkspace'),
  )

  async function handleItemClick(item: MenuItemData) {
    if (item.id === 'add') {
      await workspaceStore.createWorkspace({
        name: `Workspace ${workspaceStore.workspaces.length + 1}`,
      })
      return
    }

    const itemId = Number(item.id)
    if (isNaN(itemId)) return
    workspaceStore.changeCurrentWorkspace(itemId)
  }

  function openWorkspaceMenu(event: MouseEvent) {
    const rect = getRect(event)

    const items = computed(() => {
      return [
        ...workspaceStore.workspaces.map<MenuItemData>(
          (w) => ({
            id: `${w.id}`,
            label: w.name,
            selected:
              w.id === workspaceStore.currentWorkspaceId,
            icon:
              w.id === workspaceStore.currentWorkspaceId
                ? TickIcon
                : undefined,
          }),
        ),
        createAddWorkspaceMenuItem(
          t,
          workspaceStore.workspaces.length > 0,
        ),
      ]
    })

    menuStore.open({
      posX: rect.right - rect.width / 2,
      posY: rect.bottom + 4,
      menuAnchor: 'center-top',
      menuItems: items,
      handler: handleItemClick,
    })
  }

  return { currentWorkspaceName, openWorkspaceMenu }
}
