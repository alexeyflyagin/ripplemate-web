<script setup lang="ts">
import type { CategoryRead } from '@/api/types'
import BaseButton from '@/components/ui/Button/BaseButton/BaseButton.vue'
import BaseDialog from '@/components/ui/Dialog/BaseDialog/BaseDialog.vue'
import BaseDialogHeader from '@/components/ui/Dialog/BaseDialog/BaseDialogHeader.vue'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useCategoryStore } from '@/stores/domain/category'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
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
import type { ActionType } from './CategoryDialog.types'
import { ApiError } from '@/api/client'
import RefreshIcon from '~icons/icons-16/refresh'

const props = defineProps<{
  categoryId?: number
}>()

const MAX_CATEGORY_NAME_LENGTH = 24

const { t } = useI18n()

const categoryStore = useCategoryStore()
const { currentWorkspaceId } = useCurrentWorkspace()
const { selectCategory } = useCurrentCategory()

const emit = defineEmits<{
  close: []
}>()

const oldCategory = ref<CategoryRead | undefined>()

const isLoading = ref<boolean>(false)

const actionType = computed<ActionType>(() => {
  return props.categoryId ? 'edit' : 'create'
})

const nameFieldRef = useTemplateRef('nameField')
const nameValue = ref<string>('')
const nameError = ref<string>('')
const resetIcon = computed<Component | undefined>(() => {
  if (!oldCategory.value) return undefined
  return oldCategory.value.name !== nameValue.value
    ? RefreshIcon
    : undefined
})

const headerTitle = computed<string>(() => {
  switch (actionType.value) {
    case 'create':
      return t('dialog.category.new.title')
    case 'edit':
      return t('dialog.category.edit.title')
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
      await createCategory()
      break
    case 'edit':
      await updateCategory()
      break
  }
  isLoading.value = false
}

async function createCategory() {
  if (!currentWorkspaceId.value) return
  try {
    const created = await categoryStore.createCategory(
      currentWorkspaceId.value,
      {
        name: nameValue.value.trim(),
      },
    )
    selectCategory(created.id)
    emit('close')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      nameError.value = t(
        'dialog.category.error.alreadyExists',
      )
    }
  }
}

async function updateCategory() {
  if (!oldCategory.value) return
  if (nameValue.value === oldCategory.value.name) {
    emit('close')
    return
  }
  try {
    if (!currentWorkspaceId.value) return
    await categoryStore.updateCategory(
      currentWorkspaceId.value,
      oldCategory.value.id,
      {
        name: nameValue.value.trim(),
      },
    )
    emit('close')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      nameError.value = t(
        'dialog.category.error.alreadyExists',
      )
    }
  }
}

async function setOldData() {
  if (!props.categoryId) return
  if (!currentWorkspaceId.value) return
  oldCategory.value = await categoryStore.getCategory(
    currentWorkspaceId.value,
    props.categoryId,
  )
  nameValue.value = oldCategory.value.name
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
    <div class="category-dialog">
      <BaseDialogHeader
        :title="headerTitle"
        @close="emit('close')"
      />
      <form @submit.prevent="onSubmit">
        <div class="category-dialog__scroll-view">
          <div class="category-dialog__content">
            <BaseTextField
              ref="nameField"
              class="category-dialog__name-field"
              :label="t('general.label.name')"
              :max-length="MAX_CATEGORY_NAME_LENGTH"
              v-model:model-value="nameValue"
              :autocomplete="false"
              :error="!!nameError"
              :supporting-text="nameError"
              :trailing-icon="resetIcon"
              @trailing-click="
                () => (nameValue = oldCategory?.name ?? '')
              "
            />
          </div>
        </div>
        <div class="category-dialog__actions">
          <BaseButton
            class="category-dialog__submit"
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
.category-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.category-dialog__content {
  padding: 0 var(--space-24) var(--space-24);
}

.category-dialog__actions {
  display: flex;
  padding: var(--space-12);
  border-top: var(--stroke-subtle) solid var(--border-muted);
}

.category-dialog__submit {
  flex: 1;
}
</style>
