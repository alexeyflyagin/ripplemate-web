<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import type { NavItemData } from './NavBar.types.ts'
import NavItem from './NavItem.vue'
const selectedId = defineModel<string>('selectedId', {
  required: true,
})

defineProps<{
  navItems: NavItemData[]
}>()

const navIndicatorEl = useTemplateRef('navContainerEl')
const itemEls = ref<Map<string, HTMLElement>>(new Map())
const navIndicatorOffset = ref<number>(0)

watch([selectedId, navIndicatorEl], () => {
  updateNavIndicatorOffset()
})

function updateNavIndicatorOffset() {
  if (!navIndicatorEl.value) return

  navIndicatorOffset.value =
    itemEls.value.get(selectedId.value)?.offsetLeft ?? 0
}

function setTabRef(
  id: string,
  el: HTMLElement | undefined,
) {
  if (el) itemEls.value.set(id, el)
  else itemEls.value.delete(id)
}
</script>

<template>
  <div class="nav-bar">
    <div ref="navContainerEl" class="nav-bar__container">
      <NavItem
        v-for="(item, index) in navItems"
        :ref="(el: any) => setTabRef(item.id, el?.$el)"
        :key="item.id"
        v-bind="item"
        :selected="item.id === selectedId"
        :style="{ marginLeft: index === 0 ? 0 : '-4px' }"
        @click="selectedId = item.id"
      />
      <div
        ref="navIndicatorEl"
        class="nav-bar__indicator"
        :style="{
          transform: `translateX(${navIndicatorOffset}px)`,
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/shadows' as *;
@use '@/assets/styles/blur' as *;

.nav-bar {
  @include elevation-1;
  @include background-blur-15;
  position: relative;
  display: inline-flex;
  border-radius: var(--corner-full);
  background-color: var(--surface-highest-80);
  outline: var(--stroke-subtle) solid var(--border-muted);
  transition: outline-color 0.2s ease;
  overflow: hidden;
}

.nav-bar__container {
  display: flex;
}

.nav-bar__indicator {
  position: absolute;
  width: 40px;
  height: 40px;
  top: var(--space-4);
  left: var(--space-4);
  border-radius: var(--corner-full);
  background-color: var(--accent);
  opacity: var(--opacity-20);
  pointer-events: none;
}
</style>
