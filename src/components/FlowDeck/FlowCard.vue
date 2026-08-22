<script setup lang="ts">
import AnswerButton from '../Buttons/AnswerButton.vue'
import CaretUpIcon from '~icons/icons-16/caret-up'
import type {
  AnswerType,
  FlowCardData,
} from './FlowDeck.types.ts'
import { useI18n } from 'vue-i18n'
import { ref, toRef, watch } from 'vue'
import { useFitText } from './useFitText.ts'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    data: FlowCardData
    progress?: number
    animated?: boolean
  }>(),
  {
    progress: 0,
    animated: true,
  },
)

const emit = defineEmits<{
  answer: [type: AnswerType]
}>()

const containerEl = ref()
const termEl = ref()

const hardButtonDisabled = ref<boolean>(false)
const goodButtonDisabled = ref<boolean>(false)
const easyButtonDisabled = ref<boolean>(false)
const letAnswer = ref<boolean>(true)

function answer(type: AnswerType) {
  emit('answer', type)
  switch (type) {
    case 'easy':
      hardButtonDisabled.value = true
      goodButtonDisabled.value = true
      break
    case 'good':
      hardButtonDisabled.value = true
      easyButtonDisabled.value = true
      break
    case 'hard':
      goodButtonDisabled.value = true
      easyButtonDisabled.value = true
      break
  }
  letAnswer.value = false
}

watch(
  () => props.progress,
  (v) => {
    letAnswer.value = v === 0
  },
)

useFitText(
  termEl,
  containerEl,
  toRef(() => props.data.term),
)

function reset() {
  hardButtonDisabled.value = false
  goodButtonDisabled.value = false
  easyButtonDisabled.value = false
  letAnswer.value = true
}

defineExpose({ reset })
</script>

<template>
  <div
    class="flow-card"
    :class="{
      'flow-card--progress-full': progress >= 1,
      'flow-card--animated': animated,
    }"
    :style="{ '--progress': progress }"
  >
    <div class="flow-card__content">
      <div class="flow-card__card" ref="containerEl">
        <p class="flow-card__term" ref="termEl">
          {{ data.term }}
        </p>
      </div>
      <div class="flow-card__answer">
        <div class="flow-card__button-group">
          <AnswerButton
            class="answer-button"
            :label="t('flow.answer.hard')"
            :disabled="hardButtonDisabled"
            :clickable="letAnswer"
            color="red"
            @click="answer('hard')"
          />
          <AnswerButton
            class="answer-button"
            :label="t('flow.answer.good')"
            :disabled="goodButtonDisabled"
            :clickable="letAnswer"
            color="yellow"
            @click="answer('good')"
          />
          <AnswerButton
            class="answer-button"
            :label="t('flow.answer.easy')"
            :disabled="easyButtonDisabled"
            :clickable="letAnswer"
            color="green"
            @click="answer('easy')"
          />
        </div>
        <div class="flow-card__forgot-hint">
          <CaretUpIcon width="16px" height="16px" />
          <p>{{ t('flow.answer.forgotCard') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.flow-card {
  background-color: var(--bg);
  user-select: none;
  -webkit-user-drag: none;

  &--animated {
    transition: border-radius 0.2s var(--ease-emphasized);

    .flow-card__forgot-hint {
      transition:
        transform 0.2s var(--ease-emphasized),
        opacity 0.2s var(--ease-emphasized);
    }

    .flow-card__button-group {
      transition:
        opacity 0.2s var(--ease-emphasized),
        transform 0.2s var(--ease-emphasized);
    }
  }

  &--progress-full {
    .flow-card__button-group {
      pointer-events: none;
      transform: scale(1);
      opacity: 0;
    }

    .flow-card__forgot-hint {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

.flow-card__content {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.flow-card__card {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  overflow: hidden;
  margin-top: var(--space-32);
  margin-bottom: var(--space-32);
}

.flow-card__term {
  @include text-heading;
  line-height: 1.2;
  color: var(--text);
  text-align: center;
}

.flow-card__answer {
  position: relative;
  display: flex;
  height: 48px;
  margin-bottom: 10px;
}

.flow-card__button-group {
  display: flex;
  gap: var(--space-8);
  flex: 1;
  opacity: calc(1 - var(--progress) * 0.6);
  transform: scale(calc((1 - var(--progress)) * 0.2 + 0.8));
}

.answer-button {
  flex: 1;
  text-transform: uppercase;
}

.flow-card__forgot-hint {
  @include text-label;
  position: absolute;
  display: flex;
  inset: 0;
  flex-direction: column;
  align-items: center;
  align-self: center;
  color: var(--text-placeholder);
  transform: translateY(48px);
  pointer-events: none;
  opacity: calc(var(--progress) * 0.5);
}
</style>
