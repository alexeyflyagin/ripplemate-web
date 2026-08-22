<script setup lang="ts">
import {
  RoundIconButton,
  type RoundIconButtonData,
} from '@/components/ui/Button/RoundIconButton/index.ts'
import { onMounted, ref, watch } from 'vue'
import { nextTick } from 'vue'
import type { ActionCaptionData } from './TermTextField.types.ts'

const modelValue = defineModel<string>('modelValue', {
  default: '',
})

defineProps<{
  placeholder?: string
  actionCaption?: ActionCaptionData
  leadingButton?: RoundIconButtonData
  secondaryButton?: RoundIconButtonData
  submitButton?: RoundIconButtonData
  maxLength?: number
}>()

const emit = defineEmits<{
  submitClick: []
  secondaryClick: []
  leadingClick: []
}>()

defineExpose({ focusInput })

const MAX_FADE = 20
const startFade = ref<number>(0)
const endFade = ref<number>(0)
let textResizeObserver: ResizeObserver | null = null
const textAreaEl = ref<HTMLTextAreaElement>()
const isTouchDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0

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

function focusInput() {
  textAreaEl.value?.focus()
}

function onEnter(e: KeyboardEvent) {
  if (e.shiftKey) return
  if (isTouchDevice) return
  e.preventDefault()
  emit('submitClick')
}

onMounted(async () => {
  textResizeObserver = new ResizeObserver(async () => {
    await nextTick()
    updateFade()
  })

  if (textAreaEl.value)
    textResizeObserver.observe(textAreaEl.value)
})
</script>

<template>
  <div class="term-text-field" @click="focusInput">
    <div v-if="actionCaption" class="action-caption">
      <div class="action-caption__container">
        <component
          v-if="actionCaption.icon"
          class="action-caption__icon"
          :is="actionCaption.icon"
        />
        <span class="action-caption__caption">
          {{ actionCaption.caption }}
        </span>
        <span
          v-if="actionCaption.value"
          class="action-caption__value"
        >
          {{ actionCaption.value }}
        </span>
      </div>
    </div>
    <div class="main-content">
      <RoundIconButton
        v-if="leadingButton"
        v-bind="leadingButton"
        @click="emit('leadingClick')"
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
          'padding-left': `${leadingButton ? 'var(--space-8)' : 'var(--space-24)'}`,
          'padding-right': `${secondaryButton || submitButton ? 'var(--space-8)' : 'var(--space-24)'}`,
        }"
        @keydown.enter="onEnter"
        @input="
          modelValue = (
            $event.target as HTMLTextAreaElement
          ).value
        "
        @scroll="onScroll"
      />
      <RoundIconButton
        v-if="secondaryButton"
        v-bind="secondaryButton"
        @click="emit('secondaryClick')"
      />
      <RoundIconButton
        v-if="submitButton"
        v-bind="submitButton"
        @click="emit('submitClick')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;
@use '@/assets/styles/blur' as *;
@use '@/assets/styles/mixins' as *;

.term-text-field {
  @include background-blur-6;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-60);
  border-radius: 26px;
  overflow: hidden;
  min-height: 52px;
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
}

.main-content {
  position: relative;
  display: flex;
  flex: 1;
  align-items: flex-end;
}

.text-area {
  @include fade-mask(to bottom);
  @include text-body;
  flex: 1 1 0;
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

.action-caption {
  display: flex;

  &__container {
    @include text-label;
    display: flex;
    margin: var(--space-8) var(--space-8) 0;
    padding: var(--space-12) var(--space-16);
    border-radius: var(--corner-full);
    background-color: var(--accent-10);
    flex: 1;
    overflow: hidden;
    align-items: center;
    color: var(--accent);
  }

  &__icon {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    margin-right: var(--space-8);
  }

  &__caption {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value {
    @include text-label-emphasized;
    color: var(--text);
    margin-left: var(--space-4);
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 100px;
  }
}
</style>
