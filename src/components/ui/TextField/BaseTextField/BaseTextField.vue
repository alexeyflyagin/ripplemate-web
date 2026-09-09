<script setup lang="ts">
import { BaseIconButton } from '@/components/ui/Button/BaseIconButton'
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
    autocomplete?: boolean
    type?:
      | 'text'
      | 'password'
      | 'email'
      | 'number'
      | 'tel'
      | 'url'
      | 'search'
    inputmode?:
      | 'none'
      | 'text'
      | 'decimal'
      | 'numeric'
      | 'tel'
      | 'search'
      | 'email'
      | 'url'
    pattern?: string
  }>(),
  {
    type: 'text',
    autocomplete: true,
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

defineExpose({ focusInput })
</script>

<template>
  <div
    class="text-field-wrapper"
    :class="{
      'text-field-wrapper--focused': isFocused,
      'text-field-wrapper--error': error,
      'text-field-wrapper--disabled': disabled,
    }"
  >
    <div class="text-field" @click="focusInput">
      <BaseIconButton
        v-if="leadingIcon && leadingIsButton"
        class="text-field__leading-button"
        :icon="leadingIcon"
        :disabled="disabled"
        @mousedown.prevent
        @click.stop="emit('leadingClick')"
      />
      <span
        v-else-if="leadingIcon"
        class="text-field__icon-container"
      >
        <component
          class="text-field__icon"
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
          :maxlength="maxLength"
          :readonly="readonly"
          :disabled="disabled"
          rows="1"
          class="text-field__input"
          ref="inputEl"
          :placeholder="placeholder"
          :value="modelValue"
          :autocomplete="autocomplete ? 'on' : 'off'"
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
          :inputmode="inputmode"
          :pattern="pattern"
          :maxLength="maxLength"
          :readonly="readonly"
          :autocomplete="autocomplete ? 'on' : 'off'"
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
        class="text-field__trailing-icon"
        :icon="trailingIcon"
        :disabled="disabled"
        @mousedown.prevent
        @click.stop="emit('trailingClick')"
      />
    </div>
    <span
      v-if="supportingText"
      class="text-field__supporting"
      v-html="supportingText"
    >
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.text-field {
  display: inline-flex;
  vertical-align: middle;
  position: relative;
  box-shadow: inset 0 0 0 var(--stroke-subtle) var(--border);
  min-height: 60px;
  background-color: transparent;
  border-radius: var(--corner-large);
  padding: 0 var(--space-8);
  cursor: text;
  transition: box-shadow 0.1s var(--ease-emphasized);

  @media (hover: hover) {
    &:hover {
      box-shadow: inset 0 0 0 var(--stroke-default)
        var(--border);
    }
  }
}

.text-field-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  &--focused {
    .text-field {
      box-shadow: inset 0 0 0 var(--stroke-default)
        var(--accent);
    }

    .text-field__label {
      color: var(--accent);
    }
  }

  &--error {
    .text-field {
      box-shadow: inset 0 0 0 var(--stroke-subtle)
        var(--error);
    }

    & .text-field__label {
      color: var(--error);
    }

    & .text-field__supporting {
      color: var(--error);
    }

    &.text-field-wrapper--focused {
      .text-field {
        box-shadow: inset 0 0 0 var(--stroke-default)
          var(--error);
      }
    }
  }

  &--disabled {
    & .text-field {
      opacity: var(--opacity-40);
      box-shadow: inset 0 0 0 var(--stroke-subtle)
        var(--border);
      background-color: transparent;
      pointer-events: none;
    }

    & .text-field__label {
      color: var(--text);
    }

    & .text-field__content {
      opacity: var(--opacity-30);
    }

    & .text-field__supporting {
      color: var(--text);
      opacity: var(--opacity-30);
    }
  }
}

.text-field__supporting {
  @include text-label;
  padding: 0 var(--space-12);
  color: var(--text-placeholder);
  white-space: normal;

  :deep(.supporting-link) {
    color: inherit;
    text-decoration: underline;
    word-break: break-all;
  }
}

.text-field__content {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.text-field__input {
  @include text-body;

  @media (pointer: coarse) {
    font-size: 16px;
  }

  vertical-align: top;
  border: none;
  outline: none;
  margin-top: 26px;
  box-sizing: border-box;
  background: transparent;
  min-width: 0;
  width: 100%;
  white-space: normal;
  padding: 0 var(--space-8) var(--space-8);
  color: var(--text);
  resize: none;
}

.text-field__icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.text-field__icon {
  align-items: center;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.text-field__leading-button {
  margin-top: 10px;
  align-self: flex-start;
  flex-shrink: 0;
}

.text-field__trailing-icon {
  margin-top: 10px;
  align-self: flex-start;
  flex-shrink: 0;
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
  transition: transform 0.2s var(--ease-emphasized);

  &--floating,
  .text-field:has(.text-field__input:autofill)
    .text-field__label {
    transform: translateY(-12px) scale(1);
  }
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
</style>
