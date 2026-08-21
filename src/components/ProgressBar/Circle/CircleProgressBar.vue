<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
  }>(),
  {
    delay: 0,
  },
)

let timeoutId = 0
const visible = ref<boolean>(false)

onMounted(() => {
  timeoutId = setTimeout(() => {
    visible.value = true
  }, props.delay)
})

onUnmounted(() => {
  clearTimeout(timeoutId)
})
</script>

<template>
  <div class="progress-bar">
    <svg
      class="spinner"
      :class="{ 'spinner--visible': visible }"
      viewBox="0 0 24 24"
      role="status"
    >
      <circle class="track" cx="12" cy="12" r="10" />
      <circle class="arc" cx="12" cy="12" r="10" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  display: inline-flex;
}

.spinner {
  width: 24px;
  height: 24px;
  transition:
    transform 0.5s var(--ease-standard),
    opacity 0.5s var(--ease-standard);
  transform: scale(0.8);
  opacity: 0;

  &--visible {
    transform: scale(1);
    opacity: 1;
  }
}

.track {
  fill: none;
  stroke: var(--border-muted);
  stroke-width: 3;
}

.arc {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 24 64;
  transform-origin: center;
  transform-box: fill-box;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
