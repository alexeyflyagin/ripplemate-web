<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useTemplateRef } from 'vue'

withDefaults(
  defineProps<{
    maxWidth?: number
  }>(),
  {
    maxWidth: 400,
  },
)

const emit = defineEmits<{
  overlay: []
}>()

const overlay = useTemplateRef('overlay')

useFocusTrap(overlay, {
  immediate: true,
})
</script>

<template>
  <div
    ref="overlay"
    class="overlay"
    @click.stop="emit('overlay')"
    @contextmenu.stop.prevent="emit('overlay')"
  >
    <div
      class="base-dialog"
      :style="{ 'max-width': `${maxWidth}px` }"
      @click.stop
      @contextmenu.stop.prevent
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/blur' as *;

.overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  inset: 0;
  background-color: var(--scrim-70);
  padding: var(--space-40);
}

.base-dialog {
  @include background-blur-20;
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100px;
  min-width: 100px;
  max-height: 100%;
  overflow: auto;
  background-color: var(--surface-80);
  border-radius: var(--corner-xxxlarge);
  border: var(--stroke-subtle) solid var(--border);
}
</style>
