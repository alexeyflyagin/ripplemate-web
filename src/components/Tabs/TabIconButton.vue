<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
  contextmenu: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="tab-icon-button"
    @click.stop="emit('click', $event)"
    @contextmenu.prevent="emit('contextmenu', $event)"
  >
    <div class="tab-icon-button__content">
      <component
        class="tab-icon-button__icon"
        :is="icon"
        width="16px"
        height="16px"
      />
    </div>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.tab-icon-button {
  position: relative;
  display: inline-flex;
  width: 40px;
  height: 40px;
  padding: 0;
  flex-shrink: 0;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 0;
  background-color: transparent;
  cursor: pointer;
  color: var(--accent);
  z-index: 0;

  @media (hover: hover) {
    &:hover .tab-icon-button__content::after {
      opacity: var(--opacity-8);
    }
  }

  &:focus-visible {
    outline: none;

    .tab-icon-button__content {
      @include focus-outline;
      outline-offset: 0;

      &::after {
        opacity: var(--opacity-10);
      }
    }
  }

  &__icon {
    transition: transform 0.2s var(--ease-standard);
  }

  &:active &__icon {
    transform: scale(0.8);
  }
}

.tab-icon-button__content {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--corner-full);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    z-index: -1;
    background-color: var(--accent);
    opacity: 0;
  }
}
</style>
