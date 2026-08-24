<script setup lang="ts">
import BaseButton from '@/components/ui/Button/BaseButton/BaseButton.vue'
import BaseDialog from '@/components/ui/Dialog/BaseDialog/BaseDialog.vue'
import BaseDialogHeader from '@/components/ui/Dialog/BaseDialog/BaseDialogHeader.vue'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useCategoryStore } from '@/stores/domain/category'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const MAX_CATEGORY_NAME_LENGHT = 24

const { t } = useI18n()

const categoryStore = useCategoryStore()

const emit = defineEmits<{
  close: []
}>()

const nameFieldRef = useTemplateRef('nameField')
const nameValue = ref<string>('')

async function onSubmit() {
  await categoryStore.createCategory({
    name: nameValue.value.trim(),
  })
  emit('close')
}

onMounted(async () => {
  console.log(nameFieldRef.value?.focusInput())
})
</script>

<template>
  <BaseDialog ref="overlay" @overlay="emit('close')">
    <div class="new-category">
      <BaseDialogHeader
        class="new-category__header"
        :title="t('dialog.category.new.title')"
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
            />
          </div>
        </div>
        <div class="new-category__actions">
          <BaseButton
            class="new-category__submit"
            :label="t('general.action.create')"
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
