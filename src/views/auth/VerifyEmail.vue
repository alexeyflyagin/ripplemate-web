<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AuthHeader from './AuthHeader.vue'
import MessageIcon from '~icons/icons-80/message'
import TickIcon from '~icons/icons-80/tick'
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { computed, ref, watch } from 'vue'
import { useDateFormat, useIntervalFn } from '@vueuse/core'
import { useAccountStore } from '@/stores/domain/account/index.ts'
import { useRoute, useRouter } from 'vue-router'
import { CircularProgressBar } from '@/components/ui/ProgressBar/CircularProgressBar/index.ts'
import { useAuthStore } from '@/stores/domain/auth/index.ts'

const RESEND_TIMER_SECONDS = 120

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const accountStore = useAccountStore()

const isVerifying = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isVerified = ref<boolean>(false)

const timer = ref<number>(0)
const formattedTimer = useDateFormat(
  () => new Date(timer.value * 1000),
  'mm:ss',
)
const isResendDisabled = ref<boolean>(false)

const resendLabel = computed<string>(() => {
  return isResendDisabled.value
    ? t('general.action.resendIn', {
        timer: formattedTimer.value,
      })
    : t('general.action.resend')
})

const header = computed<string>(() => {
  return isVerified.value
    ? t('auth.confirmEmail.emailVerified')
    : t('auth.confirmEmail.messageSentHeader')
})

const caption = computed<string>(() => {
  if (isVerified.value && authStore.isAuthorized) {
    return ''
  } else if (isVerified.value && !authStore.isAuthorized) {
    return t('auth.confirmEmail.emailVerifiedHint')
  }
  return t('auth.confirmEmail.messageSentCaption')
})

const { pause, resume } = useIntervalFn(
  () => {
    if (timer.value > 0) {
      timer.value--
    } else {
      pause()
      isResendDisabled.value = false
    }
  },
  1000,
  { immediate: false },
)

watch(
  () => accountStore.account?.is_verified,
  (v) => {
    if (v !== undefined) isVerified.value = v
  },
  { immediate: true },
)

watch(
  () => route.query.token,
  async (token) => {
    if (
      isVerified.value ||
      typeof token !== 'string' ||
      !token
    ) {
      if (!authStore.isAuthorized)
        router.replace({ name: 'root' })
      else if (
        accountStore.account &&
        !accountStore.account.is_verified
      )
        await onResend()
      return
    }
    try {
      isVerifying.value = true
      await accountStore.verifyEmail(token)
      isVerified.value = true
    } catch {
      if (!authStore.isAuthorized)
        router.replace({ name: 'root' })
    } finally {
      isVerifying.value = false
    }
  },
  { immediate: true },
)

function startTimer() {
  timer.value = RESEND_TIMER_SECONDS
  isResendDisabled.value = true
  resume()
}

async function onResend() {
  if (isResendDisabled.value || isLoading.value) return
  isLoading.value = true
  try {
    await accountStore.requestVerifyEmail()
    startTimer()
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="verify-email">
    <CircularProgressBar v-if="isVerifying" />
    <div v-if="!isVerifying" class="content">
      <TickIcon
        v-if="isVerified"
        class="verify-email__message-icon"
      />
      <MessageIcon
        v-else
        class="verify-email__message-icon"
      />
      <AuthHeader :title="header" :subtitle="caption" />
      <div class="verify-email__actions">
        <BaseButton
          v-if="!isVerified"
          class="send-again"
          variant="accent"
          :label="resendLabel"
          :loading="isLoading"
          :disabled="isResendDisabled"
          @click="onResend"
        />
        <BaseButton
          v-if="isVerified && authStore.isAuthorized"
          class="next-button"
          variant="accent"
          :label="t('general.action.letsGo')"
          :loading="isLoading"
          :disabled="isResendDisabled"
          @click="router.replace({ name: 'root' })"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.verify-email {
  min-height: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-32);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: var(--space-32) 0;
  max-width: var(--max-content-width-400);
}

.verify-email__actions {
  display: flex;
  width: 100%;
  gap: var(--space-8);
  flex-direction: column;
  margin-top: var(--space-32);
}

.verify-email__message-icon {
  width: 60px;
  height: 60px;
  color: var(--text-muted);
  margin-bottom: var(--space-8);
}
</style>
