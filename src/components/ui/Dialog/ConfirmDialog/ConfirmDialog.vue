<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const { t } = useI18n()

const props = withDefaults(
defineProps<{
  title: string
  caption: string
    type: 'info' | 'positive' | 'destructive'
    confirm?: string
    cancel?: string
    overlayClickIsCancel?: boolean
  }>(),
  {
    type: 'info',
    overlayClickIsCancel: true,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
  overlay: []
}>()

const confirm = computed(() => {
  return props.confirm
    ? props.confirm
    : t('general.action.yes')
})

const cancel = computed(() => {
  if (props.cancel) return props.cancel
  if (props.type === 'info') return t('general.action.ok')

  return t('general.action.cancel')
})

function onOverlay() {
  emit('overlay')
  if (props.overlayClickIsCancel) emit('cancel')
}

</script>

<template>
  <div
    class="dialog-overlay"
    ref="overlay"
    @click.stop="onOverlay"
    @contextmenu.stop.prevent="onOverlay"
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
          class="dialog__cancel"
          ref="cancelButtonRef"
          :label="cancel"
          @click="emit('cancel')"
        />
        <BaseButton
          v-if="type !== 'info'"
          class="dialog__confirm"
          ref="confirmButtonRef"
          :label="confirm"
          :variant="
            type === 'destructive'
              ? 'danger-text'
              : 'accent'
          "
          :style="{
            order: type === 'destructive' ? -1 : 0,
          }"
          @click="emit('confirm')"
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
  background-color: var(--scrim-70);
  user-select: none;
}

.dialog {
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
