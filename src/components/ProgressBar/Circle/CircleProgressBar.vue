<script setup lang="ts"></script>

<template>
  <div class="progress-bar">
    <svg class="spinner" viewBox="0 0 24 24" role="status">
      <circle class="track" cx="12" cy="12" r="10" />
      <circle class="arc" cx="12" cy="12" r="10" />
    </svg>
  </div>
</template>

<style scoped>
.progress-bar {
  display: inline-flex;
}

.spinner {
  width: 24px;
  height: 24px;
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
