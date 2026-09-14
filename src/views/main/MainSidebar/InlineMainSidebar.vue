<script setup lang="ts">
import MainSidebar from './MainSidebar.vue'

withDefaults(
  defineProps<{
    collapsed?: boolean
  }>(),
  {
    collapsed: false,
  },
)
</script>

<template>
  <div
    class="inline-main-sidebar"
    :class="{ 'inline-main-sidebar--collapsed': collapsed }"
  >
    <MainSidebar class="main-sidebar" />
  </div>
</template>

<style lang="scss" scoped>
.inline-main-sidebar {
  display: flex;
  width: 280px;
  border-right: var(--stroke-subtle) solid
    var(--border-muted);
  transition:
    width 0.3s var(--ease-emphasized),
    opacity 0.3s var(--ease-emphasized);

  &--collapsed {
    width: 0;
    opacity: 0;
    pointer-events: none;

    & .main-sidebar {
      transform: translateX(-40px);
    }
  }
  overflow: hidden;
}

.main-sidebar {
  flex: 1;
  min-width: 280px;
  transition: transform 0.3s var(--ease-emphasized);
}
</style>
