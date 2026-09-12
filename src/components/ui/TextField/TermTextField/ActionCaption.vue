<script setup lang="ts">
import { ref, watch } from 'vue'
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
import CloseIcon from '~icons/icons-16/close'
import { ACTION_CAPTION_HEIGHT } from './TermTextField.constants'
import type { ActionCaptionData } from './TermTextField.types'

const props = defineProps<{
  data?: ActionCaptionData | undefined
}>()

const emit = defineEmits<{
  leadingButton: [event: MouseEvent | KeyboardEvent]
  close: []
}>()

const dataCached = ref<ActionCaptionData | undefined>()

watch(
  () => props.data,
  (v) => {
    if (v) dataCached.value = v
  },
  { immediate: true },
)

function onAnimationEnd(event: AnimationEvent) {
  const name = event.animationName
  if (name.startsWith('action-caption-leave')) {
    dataCached.value = undefined
  }
}
</script>

<template>
  <div
    v-if="dataCached"
    class="action-caption"
    :class="{
      'action-caption--enter': data && !data.hide,
      'action-caption--leave': !data || data.hide,
    }"
    :style="{
      '--max-action-caption-height': `${ACTION_CAPTION_HEIGHT}px`,
    }"
    @animationend="onAnimationEnd"
  >
    <div class="action-caption__content">
      <BaseIconButton
        class="action-caption__leading-button"
        size="small"
        variant="accent-text"
        :icon="dataCached?.icon ?? (() => null)"
        @click="emit('leadingButton', $event)"
      />
      <div class="action-caption__text-group">
        <span class="action-caption__caption">
          {{ dataCached?.caption }}
        </span>
        <span class="action-caption__value">
          {{ dataCached?.value }}
        </span>
      </div>
      <div class="action-caption__actions">
        <BaseIconButton
          v-if="dataCached?.closable"
          class="action-caption__action-button"
          size="small"
          variant="danger"
          :icon="CloseIcon"
          @click="emit('close')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.action-caption {
  @include text-label;
  display: flex;
  align-items: flex-start;
  overflow: visible;

  &__content {
    display: flex;
    padding: var(--space-8) var(--space-8) var(--space-4);
    align-items: center;
    flex: 1;
    overflow: hidden;
    color: var(--accent);
  }

  &__action-button {
    border-radius: var(--corner-full);
  }

  &__text-group {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    overflow: hidden;
  }

  &__leading-button {
    margin-right: var(--space-8);
    border-radius: var(--corner-medium);
  }

  &__caption {
    @include text-label-emphasized;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value {
    color: var(--text);
    margin-top: var(--space-2);
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 100px;
  }

  &__actions {
    display: flex;
  }
}

.action-caption--enter {
  animation: action-caption-enter 0.15s
    var(--ease-emphasized) forwards;
}

@keyframes action-caption-enter {
  0% {
    opacity: 0;
    height: 0;
  }
  20% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    height: var(--max-action-caption-height);
  }
}

.action-caption--leave {
  animation: action-caption-leave 0.15s
    var(--ease-emphasized) forwards;
  pointer-events: none;
}

@keyframes action-caption-leave {
  0% {
    opacity: 1;
    height: var(--max-action-caption-height);
  }
  20% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    height: 0;
  }
}
</style>
