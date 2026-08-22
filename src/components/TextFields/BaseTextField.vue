<script setup lang="ts">
import BaseIconButton from '@/components/Buttons/BaseIconButton'
import {
  ref,
  computed,
  watch,
  onMounted,
  useId,
  type Component,
} from 'vue'

onMounted(() => {
  if (!inputEl.value) return
  inputEl.value.style.height = 'auto'
  inputEl.value.style.height = `${inputEl.value.scrollHeight}px`
})

const fieldId = useId()

const props = withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    modelValue?: string
    leadingIcon?: Component
    trailingIcon?: Component
    multiline?: boolean
    supportingText?: string
    error?: boolean
    disabled?: boolean
    readonly?: boolean
    leadingIsButton?: boolean
    maxLength?: number
    type?:
      | 'text'
      | 'password'
      | 'email'
      | 'number'
      | 'tel'
      | 'url'
      | 'search'
  }>(),
  {
    type: 'text',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  leadingClick: []
  trailingClick: []
}>()

const isFocused = ref(false)
const isFloating = computed(
  () =>
    isFocused.value ||
    !!props.placeholder ||
    (props.modelValue?.length ?? 0) > 0,
)

const inputEl = ref<HTMLInputElement | null>(null)

watch(
  () => props.type,
  () => {
    const el = inputEl.value
    if (!el) return
    if (document.activeElement !== el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    requestAnimationFrame(() => {
      el.focus()
      if (start !== null) el.setSelectionRange(start, end)
    })
  },
)

function focusInput() {
  inputEl.value?.focus()
}

function autoResize(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
}
</script>

<template>
  <div class="text-field-wrapper">
    <div
      class="text-field"
      :class="{
        'text-field--focused': isFocused,
        'text-field--error': error,
        'text-field--disabled': disabled,
      }"
      @click="focusInput"
    >
      <BaseIconButton
        v-if="leadingIcon && leadingIsButton"
        :icon="leadingIcon"
        style="margin-top: 10px; align-self: flex-start"
        :disabled="disabled"
        @mousedown.prevent
        @click.stop="emit('leadingClick')"
      />
      <span
        v-else-if="leadingIcon"
        style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          width: 40px;
          height: 40px;
        "
      >
        <component
          class="text-field__icon"
          :class="{
            'text-field__icon--disabled': disabled,
          }"
          :is="leadingIcon"
        />
      </span>
      <div
        class="text-field__content"
        :class="{
          'text-field__content--disabled': disabled,
        }"
      >
        <label
          :for="fieldId"
          class="text-field__label"
          :class="{
            'text-field__label--floating': isFloating,
          }"
        >
          {{ label }}
        </label>
        <textarea
          v-if="multiline"
          :id="fieldId"
          :type="type"
          :maxlength="maxLength"
          :readonly="readonly"
          :disabled="disabled"
          rows="1"
          class="text-field__input"
          ref="inputEl"
          :placeholder="placeholder"
          :value="modelValue"
          @input="
            (emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value,
            ),
            autoResize($event))
          "
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <input
          v-else
          :id="fieldId"
          :disabled="disabled"
          :type="type"
          :maxLength="maxLength"
          :readonly="readonly"
          class="text-field__input"
          ref="inputEl"
          :placeholder="placeholder"
          :value="modelValue"
          @input="
            emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value,
            )
          "
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
      </div>
      <BaseIconButton
        v-if="trailingIcon"
        :icon="trailingIcon"
        :disabled="disabled"
        style="margin-top: 10px; align-self: flex-start; pointer"
        @mousedown.prevent
        @click.stop="emit('trailingClick')"
      />
    </div>
    <span
      v-if="supportingText"
      class="text-field__supporting"
      :class="{
        'text-field__supporting--error': error,
        'text-field__supporting--disabled': disabled,
      }"
    >
      {{ supportingText }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.text-field-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.text-field__supporting {
  @include text-label;
  padding: 0 var(--space-12);
  color: var(--text-placeholder);
  white-space: normal;
}

.text-field__content {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.text-field {
  display: inline-flex;
  vertical-align: middle;
  position: relative;
  box-shadow: inset 0 0 0 var(--stroke-subtle) var(--border);
  min-height: 60px;
  background-color: var(--surface);
  border-radius: var(--corner-large);
  padding: 0 var(--space-8);
  cursor: text;
}

.text-field__input {
  @include text-body;
  vertical-align: top;
  border: none;
  outline: none;
  margin-top: 26px;
  box-sizing: border-box;
  background: transparent;
  white-space: normal;
  padding: 0 var(--space-8) var(--space-8);
  color: var(--text);
  resize: none;
}

.text-field__icon {
  align-items: center;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.text-field__icon--disabled {
  opacity: var(--opacity-40);
}

.text-field__label {
  @include text-label-emphasized;
  position: absolute;
  top: 22px;
  left: var(--space-8);
  transform-origin: left center;
  transform: translateY(0) scale(1.25);
  color: var(--text-muted);
  pointer-events: none;
  transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1);
}

.text-field__label--floating,
.text-field:has(.text-field__input:autofill)
  .text-field__label {
  transform: translateY(-12px) scale(1);
}

.text-field--focused {
  box-shadow: inset 0 0 0 var(--stroke-strong) var(--accent);
}

.text-field--focused .text-field__label {
  color: var(--accent);
}

.text-field--error {
  box-shadow: inset 0 0 0 var(--stroke-subtle) var(--error);
}

.text-field--error .text-field__label {
  color: var(--error);
}

.text-field__supporting--error {
  color: var(--error);
}

.text-field--error.text-field--focused {
  box-shadow: inset 0 0 0 var(--stroke-strong) var(--error);
}

.text-field--disabled {
  box-shadow: inset 0 0 0 var(--stroke-subtle) var(--border);
  background-color: transparent;
  pointer-events: none;
}

.text-field__content--disabled .text-field__label {
  color: var(--text);
}

.text-field__content--disabled {
  opacity: var(--opacity-30);
}

.text-field__supporting--disabled {
  color: var(--text);
  opacity: var(--opacity-30);
}
</style>
