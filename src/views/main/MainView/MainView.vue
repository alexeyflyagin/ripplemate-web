<script setup lang="ts">
import MainHeader from '@/views/main/MainHeader/MainHeader.vue'
import { useCurrentWorkspace } from '@/stores/domain/workspace/useCurrentWorkspace'
import { useCategoryStore } from '@/stores/domain/category'
import BottomNavigation from './BottomNavigation/BottomNavigation.vue'
import { computed, ref, useTemplateRef, watch } from 'vue'
import InlineMainSidebar from '../MainSidebar/InlineMainSidebar.vue'
import { useBreakpoints } from '@vueuse/core'
import OverlayMainSidebar from '../MainSidebar/OverlayMainSidebar.vue'
import { useRoute } from 'vue-router'

const MOBILE_BREAKPOINT = 760

const categoryStore = useCategoryStore()
const route = useRoute()

const isContentUnderHeader = ref<boolean>(false)
const isFlowView = computed(() => route.name === 'flow')
const showHeaderBorder = computed(
  () => !isFlowView.value && isContentUnderHeader.value,
)

const bottomNavigationRef = useTemplateRef<
  InstanceType<typeof BottomNavigation>
>('bottomNavigationRef')

const mainHeaderHeight = ref<number>(0)
const bottomNavigationHeight = ref<number>(0)
const showSidebar = ref<boolean>(true)
const breakpoints = useBreakpoints({
  mobile: MOBILE_BREAKPOINT,
})

const isMobileLayout = breakpoints.smaller('mobile')

const { currentWorkspaceId } = useCurrentWorkspace()

watch(
  currentWorkspaceId,
  (id) => {
    if (!id) {
      categoryStore.clearCategories()
      return
    }

    categoryStore.loadCategories(id)
  },
  { immediate: true },
)

watch(
  isMobileLayout,
  (v) => {
    if (v) showSidebar.value = false
    else showSidebar.value = true
  },
  { immediate: true },
)
</script>

<template>
  <div class="main-view">
    <OverlayMainSidebar
      v-if="isMobileLayout"
      class="main-view__overlay-sidebar"
      :collapsed="!showSidebar"
      @close="() => (showSidebar = false)"
    />
    <InlineMainSidebar
      v-if="!isMobileLayout"
      class="main-view__sidebar"
      :collapsed="!showSidebar"
    />
    <div
      class="main-view__content"
      :class="{
        'main-view__content--overlay-opened':
          isMobileLayout && showSidebar,
      }"
    >
      <MainHeader
        class="main-view__header"
        :bottom-border="showHeaderBorder"
        :transparent="isFlowView"
        v-model:show-sidebar="showSidebar"
        @height-changed="(h) => (mainHeaderHeight = h)"
      />

      <RouterView
        class="router"
        :style="{
          '--bottom-navigation-height': `${bottomNavigationHeight}px`,
          '--main-header-height': `${mainHeaderHeight}px`,
        }"
        :header-height="mainHeaderHeight"
        @edit-card="bottomNavigationRef?.onEditCard"
        @content-scrolled="
          (v: boolean) => (isContentUnderHeader = v)
        "
      />

      <BottomNavigation
        ref="bottomNavigationRef"
        class="main-view__navigation"
        @height-changed="
          (v) => (bottomNavigationHeight = v)
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/shadows' as *;

.main-view {
  position: relative;
  display: flex;
  height: 100%;

  &__overlay-sidebar {
    position: absolute;
    inset: 0;
    z-index: 200;
  }

  &__sidebar {
    flex-shrink: 0;
  }

  &__content {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    transition: transform 0.2s var(--ease-emphasized);

    &--overlay-opened {
      transform: translateX(40px);
    }
  }

  &__header {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
  }

  &__navigation {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.router {
  flex: 1;
  min-height: 0;
}
</style>
