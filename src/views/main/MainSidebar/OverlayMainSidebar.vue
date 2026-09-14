<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import MainSidebar from './MainSidebar.vue'
import { useManagedFocusTrap } from '@/composables/useManagedFocusTrap.ts'

const props = withDefaults(
  defineProps<{
    collapsed?: boolean
  }>(),
  {
    collapsed: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

const overlayRef = useTemplateRef('overlayRef')
const focusTrap = useManagedFocusTrap(overlayRef)

watch(
  () => props.collapsed,
  (v) => {
    if (!v) focusTrap.activate()
    else focusTrap.deactivate()
  },
  { immediate: true },
)
</script>

<template>
  <div
    ref="overlayRef"
    class="overlay"
    @click="emit('close')"
    :class="{ 'overlay--collapsed': collapsed }"
  >
    <div
      class="inline-main-sidebar"
      :class="{
        'inline-main-sidebar--collapsed': collapsed,
      }"
      @click.stop
    >
      <MainSidebar
        class="main-sidebar"
        @category-selected="emit('close')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;

.overlay {
  display: flex;
  background-color: var(--scrim-30);
  transition: background-color 0.3s var(--ease-emphasized);

  &--collapsed {
    background-color: transparent;
    pointer-events: none;
  }
}

.inline-main-sidebar {
  @include elevation-1;
  display: flex;
  width: 280px;
  transition:
    transform 0.2s var(--ease-emphasized),
    opacity 0.2s var(--ease-emphasized);
  background-color: var(--bg);
  border-right: var(--stroke-subtle) solid
    var(--border-muted);

  &--collapsed {
    transform: translateX(-280px);
    border-right: none;
    pointer-events: none;

    & .main-sidebar {
      opacity: 0;
    }
  }
  overflow: hidden;
}

.main-sidebar {
  flex: 1;
  min-width: 280px;
  transition: opacity 0.2s var(--ease-emphasized);
}
</style>
