<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'

defineProps<{
  title: string
  caption: string
  confirm: string
  cancel: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div
    class="dialog-overlay"
    @click="emit('cancel')"
    @contextmenu="emit('cancel')"
  >
    <div
      class="dialog"
      @click.stop
      @contextmenu.stop.prevent
    >
      <div class="dialog__content">
        <h1 class="dialog__title">{{ title }}</h1>
        <p class="dialog__caption" v-html="caption" />
      </div>
      <div class="dialog__actions">
        <BaseButton
          class="dialog__confirm"
          :label="confirm"
          variant="danger-text"
          @click="emit('confirm')"
        />
        <BaseButton
          class="dialog__cancel"
          :label="cancel"
          @click="emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/blur' as *;
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/shadows' as *;

.dialog-overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  inset: 0;
  background-color: color-mix(
    in srgb,
    black 40%,
    transparent
  );
  user-select: none;
}

.dialog {
  @include elevation-4;
  @include background-blur-10;
  display: flex;
  width: 100%;
  max-width: var(--max-content-width-300);
  flex-direction: column;
  background-color: var(--surface-80);
  border-radius: var(--corner-xxxlarge);
  border: var(--stroke-subtle) solid var(--border);
  margin: var(--space-40);
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  padding: var(--space-24);
}

.dialog__title {
  @include text-title;
  color: var(--text);
}

.dialog__caption {
  @include text-caption;
  color: var(--text-muted);

  :deep(strong) {
    color: var(--text);
  }
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 var(--space-12) var(--space-12);
}
</style>
