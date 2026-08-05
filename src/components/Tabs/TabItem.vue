<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
  selected?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
  contextmenu: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="tab-item"
    @click.stop="emit('click', $event)"
    @contextmenu.prevent="emit('contextmenu', $event)"
  >
    <div
      class="tab-item__content"
      :class="{
        'tab-item__content--active': active,
        'tab-item__content--selected': selected,
      }"
    >
      <span class="tab-item__label">
        {{ label }}
      </span>
    </div>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/text-styles' as *;

.tab-item {
  @include text-label;
  position: relative;
  background-color: transparent;
  border: none;
  flex-shrink: 0;
  vertical-align: middle;
  padding: var(--space-4) var(--space-2);
  cursor: pointer;

  &:focus-visible {
    outline: none;

    .tab-item__content {
      @include focus-outline;
      outline-offset: 0;
    }
  }

  &:active .tab-item__label {
    transform: scale(0.96);
  }
}

.tab-item__label {
  display: inline-block;
  transition: transform 0.2s var(--ease-standard);
}

.tab-item__content {
  position: relative;
  padding: var(--space-8) var(--space-12);
  border-radius: var(--corner-full);
  color: var(--text-muted);
  transform: scale(var(--tab-scale, 1));
  transition:
    color 0.2s var(--ease-standard),
    transform 0.4s var(--ease-standard);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--text);
    opacity: 0;
    transition: opacity 0.1s var(--ease-standard);
  }

  &--selected {
    color: var(--text);

    &::after {
      opacity: var(--opacity-8);
    }
  }

  &--active {
    color: var(--text);
  }
}
</style>
