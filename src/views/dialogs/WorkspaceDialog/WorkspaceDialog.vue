<script setup lang="ts">
import type { WorkspaceRead } from '@/api/types'
import BaseButton from '@/components/ui/Button/BaseButton/BaseButton.vue'
import BaseDialog from '@/components/ui/Dialog/BaseDialog/BaseDialog.vue'
import BaseDialogHeader from '@/components/ui/Dialog/BaseDialog/BaseDialogHeader.vue'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type Component,
} from 'vue'
import { useI18n } from 'vue-i18n'
import type { ActionType } from './WorkspaceDialog.types'
import { ApiError } from '@/api/client'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import RefreshIcon from '~icons/icons-16/refresh'

const props = defineProps<{
  workspaceId?: number
}>()

const MAX_WORKSPACE_NAME_LENGTH = 24

const { t } = useI18n()

const workspaceStore = useWorkspaceStore()

const emit = defineEmits<{
  close: []
}>()

const oldWorkspace = ref<WorkspaceRead>()

const isLoading = ref<boolean>(false)

const actionType = computed<ActionType>(() => {
  return props.workspaceId ? 'edit' : 'create'
})

const nameFieldRef = useTemplateRef('nameField')
const nameValue = ref<string>('')
const nameError = ref<string>('')
const resetIcon = computed<Component | undefined>(() => {
  if (!oldWorkspace.value) return undefined
  return oldWorkspace.value.name !== nameValue.value
    ? RefreshIcon
    : undefined
})

const headerTitle = computed<string>(() => {
  switch (actionType.value) {
    case 'create':
      return t('dialog.workspace.new.title')
    case 'edit':
      return t('dialog.workspace.edit.title')
  }
})

const submitLabel = computed<string>(() => {
  switch (actionType.value) {
    case 'create':
      return t('general.action.create')
    case 'edit':
      return t('general.action.save')
  }
})

async function onSubmit() {
  if (isLoading.value) return
  isLoading.value = true
  switch (actionType.value) {
    case 'create':
      await createWorkspace()
      break
    case 'edit':
      await updateWorkspace()
      break
  }
  isLoading.value = false
}

async function createWorkspace() {
  try {
    await workspaceStore.createWorkspace({
      name: nameValue.value.trim(),
    })
    emit('close')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      nameError.value = t(
        'dialog.workspace.error.alreadyExists',
      )
    }
  }
}

async function updateWorkspace() {
  if (!oldWorkspace.value) return
  if (nameValue.value === oldWorkspace.value.name) {
    emit('close')
    return
  }
  try {
    await workspaceStore.updateWorkspace(
      oldWorkspace.value.id,
      {
        name: nameValue.value.trim(),
      },
    )
    emit('close')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      nameError.value = t(
        'dialog.workspace.error.alreadyExists',
      )
    }
  }
}

async function setOldData() {
  if (!props.workspaceId) return
  oldWorkspace.value = await workspaceStore.getWorkspace(
    props.workspaceId,
  )
  nameValue.value = oldWorkspace.value.name
}

watch(nameValue, async (v) => {
  await nextTick()
  nameValue.value = v.trimStart()
  if (nameError.value) nameError.value = ''
})

onMounted(async () => {
  await setOldData()
  nameFieldRef.value?.focusInput()
})
</script>

<template>
  <BaseDialog ref="overlay" @overlay="emit('close')">
    <div class="workspace-dialog">
      <BaseDialogHeader
        class="workspace-dialog__header"
        :title="headerTitle"
        @close="emit('close')"
      />
      <form @submit.prevent="onSubmit">
        <div class="workspace-dialog__scroll-view">
          <div class="workspace-dialog__content">
            <BaseTextField
              ref="nameField"
              class="workspace-dialog__name-field"
              :label="t('general.label.name')"
              :max-length="MAX_WORKSPACE_NAME_LENGTH"
              v-model:model-value="nameValue"
              :autocomplete="false"
              :error="!!nameError"
              :supporting-text="nameError"
              :trailing-icon="resetIcon"
              @trailing-click="
                () => (nameValue = oldWorkspace?.name ?? '')
              "
            />
          </div>
        </div>
        <div class="workspace-dialog__actions">
          <BaseButton
            class="workspace-dialog__submit"
            :label="submitLabel"
            :loading="isLoading"
            variant="accent"
            type="submit"
            :disabled="!nameValue"
          />
        </div>
      </form>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.workspace-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.workspace-dialog__content {
  padding: 0 var(--space-24) var(--space-24);
}

.workspace-dialog__actions {
  display: flex;
  padding: var(--space-12);
  border-top: var(--stroke-subtle) solid var(--border-muted);
}

.workspace-dialog__submit {
  flex: 1;
}
</style>
