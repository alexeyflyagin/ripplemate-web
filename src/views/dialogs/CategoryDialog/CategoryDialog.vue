<script setup lang="ts">
import type { CategoryRead } from '@/api/types'
import BaseButton from '@/components/ui/Button/BaseButton/BaseButton.vue'
import BaseDialog from '@/components/ui/Dialog/BaseDialog/BaseDialog.vue'
import BaseDialogHeader from '@/components/ui/Dialog/BaseDialog/BaseDialogHeader.vue'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useCategoryStore } from '@/stores/domain/category'
import {
  computed,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import type { ActionType } from './CategoryDialog.types'
import { ApiError } from '@/api/client'

const props = defineProps<{
  categoryId?: number
}>()

const MAX_CATEGORY_NAME_LENGHT = 24

const { t } = useI18n()

const categoryStore = useCategoryStore()

const emit = defineEmits<{
  close: []
}>()

let oldCategory: CategoryRead

const isLoading = ref<boolean>(false)

const actionType = computed<ActionType>(() => {
  return props.categoryId ? 'edit' : 'create'
})

const nameFieldRef = useTemplateRef('nameField')
const nameValue = ref<string>('')
const nameError = ref<string>('')

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
  try {
    await categoryStore.createCategory({
      name: nameValue.value.trim(),
    })
    emit('close')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      nameError.value = t(
        'dialog.category.error.categoryAlreadyExists',
      )
    }
  }
}

async function updateCategory() {
  if (!oldCategory) return
  if (nameValue.value === oldCategory.name) {
    emit('close')
    return
  }
  try {
    await categoryStore.updateCategory(oldCategory.id, {
      name: nameValue.value.trim(),
    })
    emit('close')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      nameError.value = t(
        'dialog.category.error.categoryAlreadyExists',
      )
    }
  }
}

async function setOldData() {
  if (!props.categoryId) return
  oldCategory = await categoryStore.getCategory(
    props.categoryId,
  )
  nameValue.value = oldCategory.name
}

watch(nameValue, (v) => {
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
    <div class="new-category">
      <BaseDialogHeader
        class="new-category__header"
        :title="headerTitle"
        @close="emit('close')"
      />
      <form @submit.prevent="onSubmit">
        <div class="new-category__scroll-view">
          <div class="new-category__content">
            <BaseTextField
              ref="nameField"
              class="new_category__name-field"
              :label="t('general.label.name')"
              :max-length="MAX_CATEGORY_NAME_LENGHT"
              v-model:model-value="nameValue"
              :autocomplete="false"
              :error="!!nameError"
              :supporting-text="nameError"
            />
          </div>
        </div>
        <div class="new-category__actions">
          <BaseButton
            class="new-category__submit"
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
.new-category {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.new-category__content {
  padding: 0 var(--space-24) var(--space-24);
}

.new-category__actions {
  display: flex;
  padding: var(--space-12);
  border-top: var(--stroke-subtle) solid var(--border-muted);
}

.new-category__submit {
  flex: 1;
}
</style>
