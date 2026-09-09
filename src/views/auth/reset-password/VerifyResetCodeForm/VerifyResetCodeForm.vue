<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField/index.ts'
import { useAuthStore } from '@/stores/domain/auth/index.ts'
import { emailLinkHtml } from '@/utils/emailLink.ts'
import { ApiError } from '@/api/client.ts'
import { useResendButtonWithTimer } from '../../composables/useResendButtonWithTimer.ts'
import { RESEND_TIMER_SECONDS } from '../../AuthView.constants.ts'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const codeFieldRef =
  ref<InstanceType<typeof BaseTextField>>()

const loading = ref<boolean>(false)

const email = computed<string>(() => {
  const value = route.query.email
  return typeof value === 'string' ? value.trim() : ''
})

const code = ref<string>('')
const codeError = ref<string>('')

const { resendLabel, isResendDisabled, startTimer } =
  useResendButtonWithTimer(t, RESEND_TIMER_SECONDS)

const emailHtml = computed(() => emailLinkHtml(email.value))

async function onResend() {
  if (isResendDisabled.value || loading.value) return
  codeError.value = ''
  loading.value = true
  try {
    await authStore.requestResetPassword({
      email: email.value,
    })
    startTimer()
  } catch (e) {
    if (e instanceof ApiError && e.status === 429) {
      codeError.value = t('auth.error.tooManyRequests')
      startTimer()
    } else {
      codeError.value = t(
        'general.error.somethingWentWrong',
      )
    }
  } finally {
    loading.value = false
  }
}

async function checkCode() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await authStore.verifyResetCode({
      email: email.value,
      code: code.value,
    })
    router.replace({
      name: 'reset-password',
      query: {
        token: res.reset_token,
      },
    })
  } catch (e) {
    code.value = ''
    await nextTick()
    if (e instanceof ApiError && e.status === 400) {
      codeError.value = t('auth.error.invalidOrExpiredCode')
    } else {
      codeError.value = t(
        'general.error.somethingWentWrong',
      )
    }
  } finally {
    loading.value = false
  }
}

watch(code, async (v) => {
  if (codeError.value) codeError.value = ''

  if (v.length === 5) {
    await checkCode()
  }
})

onMounted(async () => {
  await onResend()
  codeFieldRef.value?.focusInput()
})
</script>

<template>
  <div class="verify-reset-code-form">
    <span
      class="verify-reset-code-form__emoji"
      aria-hidden="true"
      >📫</span
    >

    <AuthHeader
      class="verify-reset-code-form__header"
      :title="t('auth.forgotPassword.checkMailbox')"
      :subtitle="
        t('auth.forgotPassword.checkMailboxCaption', {
          email: emailHtml,
        })
      "
    />

    <BaseTextField
      ref="codeFieldRef"
      :label="t('general.label.code')"
      :error="!!codeError"
      :max-length="5"
      type="number"
      :supporting-text="codeError"
      :disabled="loading"
      v-model:model-value="code"
    />

    <BaseButton
      class="verify-reset-code-form__submit"
      :label="resendLabel"
      :loading="loading"
      :disabled="isResendDisabled"
      variant="accent"
      @click="onResend"
    />

    <BaseButton
      class="verify-reset-code-form__back"
      :label="t('general.action.back')"
      @click="router.back"
    />
  </div>
</template>

<style lang="scss" scoped>
.verify-reset-code-form {
  display: flex;
  flex-direction: column;

  &__emoji {
    font-size: 52px;
    align-self: center;
    margin-bottom: var(--space-32);
  }

  &__header {
    margin-bottom: var(--space-32);
  }

  &__submit {
    margin-top: var(--space-32);
  }

  &__back {
    margin-top: var(--space-8);
  }
}
</style>
