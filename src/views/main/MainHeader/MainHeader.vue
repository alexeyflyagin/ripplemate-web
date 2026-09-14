<script setup lang="ts">
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
import { useI18n } from 'vue-i18n'
import { useMoreMenu } from './useMoreMenu'
import { useTemplateRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useCurrentCategory } from '@/stores/domain/category/useCurrentCategory'
import { useFavoritesFilter } from '@/stores/domain/card/useFavoritesFilter'
import SidebarIcon from '~icons/icons-16/sidebar'
import SidebarFilledIcon from '~icons/icons-16/sidebar-filled'
import HeartIcon from '~icons/icons-16/heart'
import HeartFilledIcon from '~icons/icons-16/heart-filled'
import MoreIcon from '~icons/icons-16/more'

const { t } = useI18n()

defineProps<{
  bottomBorder?: boolean
}>()

const emit = defineEmits<{
  heightChanged: [height: number]
}>()

const { openMoreMenu, isRefreshing } = useMoreMenu(t)
const { currentCategory } = useCurrentCategory()
const { favoritesOnly } = useFavoritesFilter()

const showSidebar = defineModel<boolean>('showSidebar', {
  default: true,
})

const rootEl = useTemplateRef<HTMLElement>('rootEl')

useResizeObserver(rootEl, () => {
  emit(
    'heightChanged',
    rootEl.value?.getBoundingClientRect().height ?? 0,
  )
})
</script>

<template>
  <div
    ref="rootEl"
    class="main-header"
    :class="{ 'main-header--with-border': bottomBorder }"
  >
    <BaseIconButton
      :icon="SidebarIcon"
      :icon-selected="SidebarFilledIcon"
      :selectable="true"
      v-model:selected="showSidebar"
      :show-selected-background="false"
    />
    <h3 class="main-header__title">
      {{ currentCategory?.name ?? t('general.label.all') }}
    </h3>
    <div class="main-header__actions">
      <BaseIconButton
        :icon="HeartIcon"
        :icon-selected="HeartFilledIcon"
        :selectable="true"
        v-model:selected="favoritesOnly"
      />
      <BaseIconButton
        :icon="MoreIcon"
        :loading="isRefreshing"
        @click="openMoreMenu"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/blur' as *;

.main-header {
  @include background-blur-20;
  background-color: var(--bg-60);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: calc(var(--space-12) + env(safe-area-inset-top))
    var(--space-16) var(--space-12);

  &--with-border {
    border-bottom: var(--stroke-subtle) solid
      var(--border-muted);
  }

  &__title {
    @include text-caption-emphasized;
    color: var(--text);
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    gap: var(--space-2);
  }
}
</style>
