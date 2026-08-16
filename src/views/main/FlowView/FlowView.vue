<script setup lang="ts"></script>

<template>
  <div class="flow-view">
    <span class="hint">FlowView</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.flow-view {
  position: relative;
  display: flex;
  flex: 1;
  margin-bottom: var(--bottom-container-height);
}

.hint {
  @include text-caption;
  margin: auto;
  color: var(--text-muted);
  background-color: var(--surface);
  border-radius: var(--corner-full);
  padding: var(--space-4) var(--space-12);
  outline: var(--stroke-subtle) solid var(--border-muted);
}
</style>
