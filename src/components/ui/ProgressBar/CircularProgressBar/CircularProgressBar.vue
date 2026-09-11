<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
    size?: number
    thickness?: number
    progress?: number
  }>(),
  {
    delay: 0,
    size: 24,
    thickness: 3,
    progress: 60,
  },
)

let timeoutId = 0
const visible = ref<boolean>(false)

const radius = computed<number>(() => {
  return props.size / 2 - props.thickness
})

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
  <div
    class="progress-bar"
    :style="{
      '--size': `${size}px`,
      '--circumference-length': `${2 * 3.14 * radius}`,
      '--thickness': `${thickness}px`,
      '--progress': `${progress}`,
    }"
  >
    <svg
      class="spinner"
      :class="{ 'spinner--visible': visible }"
      :viewBox="`0 0 ${size} ${size}`"
      role="status"
    >
      <circle
        class="track"
        :cx="`${size / 2}`"
        :cy="`${size / 2}`"
        :r="`${radius}`"
      />
      <circle
        class="arc"
        :cx="`${size / 2}`"
        :cy="`${size / 2}`"
        :r="`${radius}`"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  display: inline-flex;
}

.spinner {
  width: var(--size);
  height: var(--size);
  transition:
    transform 0.5s var(--ease-emphasized),
    opacity 0.5s var(--ease-emphasized);
  transform: scale(0.8);
  opacity: 0;

  &--visible {
    transform: scale(1);
    opacity: 1;
  }
}

.track {
  fill: none;
  stroke: var(--track-color, var(--border-muted));
  stroke-width: var(--thickness);
}

.arc {
  fill: none;
  stroke: var(--indicator-color, var(--accent));
  stroke-width: var(--thickness);
  stroke-linecap: round;
  stroke-dasharray: calc(
      var(--circumference-length) * var(--progress) / 100
    )
    var(--circumference-length);
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
