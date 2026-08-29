<script setup lang="ts">
import { ApiError } from '@/api/client'
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useAuthStore } from '@/stores/domain/auth'
import { sleep } from '@/utils/sleep'
import { validateEmail } from '@/utils/validations'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import EmailIcon from '~icons/icons-16/email'
import MessageIcon from '~icons/icons-80/message'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref<boolean>(false)

const isSubmitted = ref<boolean>(false)
const header = computed<string>(() => {
  return isSubmitted.value
    ? t('auth.resetPassword.messageSentHeader')
    : t('auth.resetPassword.header')
})
const caption = computed<string>(() => {
  return isSubmitted.value
    ? t('auth.resetPassword.messageSentCaption')
    : t('auth.resetPassword.caption')
})

const email = ref<string>('')
const emailError = ref<string>('')

watch(email, () => {
  emailError.value = ''
})

async function handleSubmit() {
  const emailValue = email.value.trim()
  if (!validate() || isLoading.value) return
  isLoading.value = true
  try {
    await authStore.requestResetPassword(emailValue)
    isSubmitted.value = true
  } catch (e) {
    if (e instanceof ApiError && e.status === 422) {
      emailError.value = t('auth.validation.emailInvalid')
    } else {
      emailError.value = t(
        'general.error.somethingWentWrong',
      )
    }
  } finally {
    isLoading.value = false
  }
}

function validate(): boolean {
  emailError.value = ''

  let ok = true

  if (!email.value) {
    emailError.value = t('auth.validation.emailRequired')
    ok = false
  } else if (!validateEmail(email.value)) {
    emailError.value = t('auth.validation.emailInvalid')
    ok = false
  }

  return ok
}
</script>

<template>
  <div class="forgot-password">
    <div class="content">
      <MessageIcon
        v-if="isSubmitted"
        class="forgot-password__message-icon"
      />
      <h1 class="forgot-password__header">
        {{ header }}
      </h1>
      <p class="forgot-password__caption">
        {{ caption }}
      </p>
      <form
        v-if="!isSubmitted"
        class="forgot-password__form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <div class="forget-password__fields">
          <BaseTextField
            v-model="email"
            type="email"
            :max-length="254"
            :error="!!emailError"
            :leading-icon="EmailIcon"
            :supporting-text="emailError"
            :label="t('general.label.email')"
          />
        </div>

        <BaseButton
          class="submit-button"
          variant="accent"
          :loading="isLoading"
          type="submit"
          :label="t('general.action.resetPassword')"
        />
      </form>
      <BaseButton
        class="back-button"
        :class="{
          'back-button--collapsed': isSubmitted,
        }"
        variant="default"
        :label="t('general.action.back')"
        @click="router.replace({ name: 'login' })"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/text-styles' as *;

.forgot-password {
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

.forgot-password__header {
  @include text-title;
  color: var(--text);
  margin: 0 var(--space-16);
  text-align: center;
}

.forgot-password__caption {
  @include text-caption;
  color: var(--text-muted);
  margin: var(--space-8) var(--space-16) 0;
  text-align: center;
}

.forgot-password__form {
  display: flex;
  width: 100%;
  gap: var(--space-32);
  margin-top: var(--space-32);
  flex-direction: column;
}

.back-button {
  width: 100%;
  margin-top: var(--space-8);

  &--collapsed {
    width: auto;
    margin-top: var(--space-32);
  }
}

.forgot-password__message-icon {
  width: 60px;
  height: 60px;
  color: var(--text-muted);
  margin-bottom: var(--space-8);
}
</style>
