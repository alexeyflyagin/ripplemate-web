<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { useRouter } from 'vue-router'
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField/index.ts'
import { useAuthStore } from '@/stores/domain/auth/index.ts'
import { useAccountStore } from '@/stores/domain/account/index.ts'
import { emailLinkHtml } from '@/utils/emailLink.ts'
import { ApiError } from '@/api/client.ts'
import { RESEND_TIMER_SECONDS } from '../../AuthView.constants.ts'
import { useResendButtonWithTimer } from '../../composables/useResendButtonWithTimer.ts'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const accountStore = useAccountStore()

const codeFieldRef =
  ref<InstanceType<typeof BaseTextField>>()

const loading = ref<boolean>(false)

const code = ref<string>('')
const codeError = ref<string>('')

const { resendLabel, isResendDisabled, startTimer } =
  useResendButtonWithTimer(t, RESEND_TIMER_SECONDS)

const emailHtml = computed(() =>
  emailLinkHtml(accountStore.account?.email ?? ''),
)

async function onResend() {
  if (isResendDisabled.value || loading.value) return
  codeError.value = ''
  loading.value = true
  try {
    await accountStore.requestVerifyEmail()
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
    await accountStore.verifyEmail(code.value)
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

watch(
  () => accountStore.account?.is_verified,
  (v) => {
    if (v) router.replace({ name: 'verify-email' })
  },
  { immediate: true },
)

onMounted(async () => {
  await onResend()
  codeFieldRef.value?.focusInput()
})
</script>

<template>
  <div class="verify-email-form">
    <span
      class="verify-email-form__emoji"
      aria-hidden="true"
      >📫</span
    >

    <AuthHeader
      class="verify-email-form__header"
      :title="t('auth.verifyEmail.checkMailbox')"
      :subtitle="
        t('auth.verifyEmail.checkMailboxCaption', {
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
      class="verify-email-form__submit"
      :label="resendLabel"
      :loading="loading"
      :disabled="isResendDisabled"
      variant="accent"
      @click="onResend"
    />

    <BaseButton
      class="verify-email-form__logout"
      :label="t('general.action.logout')"
      variant="danger-text"
      @click="authStore.logout"
    />
  </div>
</template>

<style lang="scss" scoped>
.verify-email-form {
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

  &__logout {
    margin-top: var(--space-8);
  }
}
</style>
