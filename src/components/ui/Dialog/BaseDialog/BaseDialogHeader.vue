<script setup lang="ts">
import BaseIconButton from '@/components/ui/Button/BaseIconButton/BaseIconButton.vue'
import CloseIcon from '~icons/icons-16/close'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="base-dialog-header">
    <h1 class="base-dialog-header__title">{{ title }}</h1>
    <BaseIconButton
      class="base-dialog-header__close-button"
      :icon="CloseIcon"
      @click="emit('close')"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.base-dialog-header {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: var(--space-12) var(--space-24);
  color: var(--text);

  &__title {
    @include text-caption-emphasized;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: var(--space-8);
  }

  &__close-button {
    margin-left: var(--space-16);
  }
}
</style>
