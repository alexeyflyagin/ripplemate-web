<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { nextTick } from 'vue'
import type { ActionCaptionData } from './TermTextField.types.ts'
import {
  BaseIconButton,
  type BaseIconButtonData,
} from '@/components/ui/Button/BaseIconButton'
import ActionCaption from './ActionCaption.vue'

const modelValue = defineModel<string>('modelValue', {
  default: '',
})

const props = defineProps<{
  placeholder?: string
  actionCaption?: ActionCaptionData
  leadingButton?: BaseIconButtonData
  secondaryButton?: BaseIconButtonData
  submitButton?: BaseIconButtonData
  maxLength?: number
  collapsed?: boolean
}>()

defineExpose({ focusInput })

const MAX_FADE = 20
const startFade = ref<number>(0)
const endFade = ref<number>(0)
let textResizeObserver: ResizeObserver | null = null
const textAreaEl = ref<HTMLTextAreaElement>()
const isTouchDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0

const animateCollapse = ref(false)

watch(
  () => props.collapsed,
  (v, oldV) => {
    if (oldV !== undefined) animateCollapse.value = true
  },
  { immediate: true },
)

watch(
  modelValue,
  async () => {
    await nextTick()
    onInput()
  },
  { immediate: true },
)

function onInput() {
  const el = textAreaEl.value
  if (!el) return
  if (el.offsetWidth < 40) return

  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function onScroll() {
  updateFade()
}

function updateFade() {
  const el = textAreaEl.value
  if (!el) return

  const topOffset = el.scrollTop
  const bottomOffset =
    el.scrollHeight - el.scrollTop - el.offsetHeight

  startFade.value =
    topOffset >= MAX_FADE ? MAX_FADE : topOffset
  endFade.value =
    bottomOffset >= MAX_FADE ? MAX_FADE : bottomOffset
}

function focusInput(toBottom?: boolean | undefined) {
  textAreaEl.value?.focus()
  if (toBottom) {
    textAreaEl.value?.setSelectionRange(
      modelValue.value.length,
      modelValue.value.length,
    )
    if (textAreaEl.value) {
      textAreaEl.value.scrollTop =
        textAreaEl.value?.scrollHeight ?? 0
    }
  }
}

function onEnter(e: KeyboardEvent) {
  if (e.shiftKey) return
  if (isTouchDevice) return
  e.preventDefault()
  props.submitButton?.onClick?.(e)
}

onMounted(async () => {
  textResizeObserver = new ResizeObserver(async () => {
    await nextTick()
    onInput()
    updateFade()
  })

  if (textAreaEl.value)
    textResizeObserver.observe(textAreaEl.value)
})
</script>

<template>
  <div
    class="term-text-field"
    :class="{
      'term-text-field--collapsed': collapsed,
      'term-text-field--collapse-animate':
        collapsed && animateCollapse,
      'term-text-field--expand-animate':
        !collapsed && animateCollapse,
    }"
    @click="() => focusInput()"
  >
    <ActionCaption
      v-if="!collapsed"
      class="action-caption"
      v-bind="{
        data: actionCaption,
        onClose: actionCaption?.onClose,
      }"
    />
    <div class="main-content">
      <BaseIconButton
        v-if="leadingButton && !collapsed"
        class="term-text-field__leading-button"
        v-bind="leadingButton"
      />
      <textarea
        ref="textAreaEl"
        class="text-area"
        rows="1"
        :maxlength="maxLength"
        :value="modelValue"
        :placeholder="placeholder"
        :style="{
          '--fade-start': `${startFade}px`,
          '--fade-end': `${endFade}px`,
          'padding-left': `${!leadingButton || collapsed ? 'var(--space-24)' : 0}`,
          'padding-right': `${secondaryButton?.hide && submitButton?.hide ? 'var(--space-24)' : 'var(--space-8)'}`,
        }"
        @keydown.enter="onEnter"
        @input="
          modelValue = (
            $event.target as HTMLTextAreaElement
          ).value
        "
        @scroll="onScroll"
      />
      <BaseIconButton
        v-if="secondaryButton && !collapsed"
        class="term-text-field__secondary-button"
        v-bind="secondaryButton"
        :init-animation="true"
        :style="{
          ...(submitButton ? { marginRight: 0 } : {}),
        }"
      />
      <BaseIconButton
        v-if="submitButton && !collapsed"
        class="term-text-field__submit-button"
        v-bind="submitButton"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/blur' as *;
@use '@/assets/styles/mixins' as *;

.term-text-field {
  @include background-blur-15;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-highest-80);
  border-radius: var(--corner-xlarge);
  overflow: hidden;
  margin: 1px;
  outline: var(--stroke-subtle) solid var(--border-muted);
  transition: outline-color 0.2s var(--ease-emphasized);

  @media (hover: hover) {
    &:hover {
      outline-color: var(--border);
    }
  }

  &:focus-within {
    outline-color: var(--border);
  }

  &__leading-button,
  &__secondary-button,
  &__submit-button {
    margin: var(--space-4);
  }
}

.main-content {
  position: relative;
  display: flex;
  min-height: 48px;
  flex: 1;
  min-width: 0;
  align-items: flex-end;
}

.text-area {
  @include fade-mask(to bottom);
  @include text-body;

  @media (pointer: coarse) {
    font-size: 16px;
  }

  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  padding: var(--space-8);
  scroll-padding: var(--space-8);
  background-color: transparent;
  border: none;
  max-height: 160px;
  align-self: center;
  vertical-align: middle;
  resize: none;
  box-sizing: border-box;
  scrollbar-width: none;
  color: var(--text);

  &::placeholder {
    color: var(--text-placeholder);
  }

  &:focus-visible {
    outline: none;
  }
}

.term-text-field--collapsed {
  border-radius: 28px;
}

.term-text-field--collapse-animate {
  animation: term-text-field-collapse 0.15s
    var(--ease-emphasized) forwards;
}

@keyframes term-text-field-collapse {
  from {
    border-radius: var(--corner-xlarge);
  }
  to {
    border-radius: 28px;
  }
}

.term-text-field--expand-animate {
  animation: term-text-field-expand 0.15s
    var(--ease-emphasized) forwards;
}

@keyframes term-text-field-expand {
  from {
    border-radius: 28px;
  }
  to {
    border-radius: var(--corner-xlarge);
  }
}
</style>
