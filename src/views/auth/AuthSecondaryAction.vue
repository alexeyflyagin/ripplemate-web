<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  caption: string
  linkLabel: string
  to: RouteLocationRaw
}>()
</script>

<template>
  <p class="auth-secondary-action">
    {{ caption }}
    <RouterLink
      class="auth-secondary-action__link"
      :to="to"
    >
      {{ linkLabel }}
    </RouterLink>
  </p>
</template>

<style lang="scss" scoped>
@use '../../assets//styles/text-styles' as *;

.auth-secondary-action {
  @include text-caption;
  color: var(--text-muted);
}

.auth-secondary-action__link {
  color: var(--accent);
}
</style>
