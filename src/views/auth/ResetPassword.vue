<script setup lang="ts">
import { ApiError } from '@/api/client'
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useAuthStore } from '@/stores/domain/auth'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import TickIcon from '~icons/icons-80/tick'
import HideIcon from '~icons/icons-16/hide'
import ShowIcon from '~icons/icons-16/show'
import AuthHeader from './AuthHeader.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref<boolean>(false)

const isSubmitted = ref<boolean>(false)
const header = computed<string>(() => {
  return isSubmitted.value
    ? t('auth.resetPassword.passwordUpdatedHeader')
    : t('auth.resetPassword.setNewPasswordHeader')
})

const token = ref<string>('')

const password = ref<string>('')
const passwordError = ref<string>('')

const confirmPassword = ref<string>('')
const confirmPasswordError = ref<string>('')

const isPasswordVisible = ref(false)
const passwordType = computed(() =>
  isPasswordVisible.value ? 'text' : 'password',
)

const passwordIcon = computed(() =>
  isPasswordVisible.value ? ShowIcon : HideIcon,
)

watch(
  () => route.query.token,
  (newToken) => {
    if (typeof newToken !== 'string' || !newToken) {
      router.replace({ name: 'root' })
      return ''
    }
    token.value = newToken
  },
  { immediate: true },
)

watch(password, () => {
  passwordError.value = ''
})
watch(confirmPassword, () => {
  confirmPasswordError.value = ''
})

async function handleSubmit() {
  if (!validate() || isLoading.value) return
  isLoading.value = true
  try {
    await authStore.resetPassword(
      token.value,
      password.value,
    )
    isSubmitted.value = true
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      router.replace({ name: 'forgot-password' })
    } else {
      passwordError.value = t(
        'general.error.somethingWentWrong',
      )
    }
  } finally {
    isLoading.value = false
  }
}

function validate(): boolean {
  let ok = true

  if (password.value.length < 8) {
    passwordError.value = t(
      'auth.validation.passwordTooShort',
    )
    ok = false
  }

  if (!confirmPassword.value) {
    confirmPasswordError.value = t(
      'auth.validation.confirmPasswordRequired',
    )
    ok = false
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = t(
      'auth.validation.passwordsDoNotMatch',
    )
    ok = false
  }

  return ok
}
</script>

<template>
  <div class="reset-password">
    <div class="content">
      <TickIcon
        v-if="isSubmitted"
        class="reset-password__message-icon"
      />
      <AuthHeader :title="header" />
      <form
        v-if="!isSubmitted"
        class="reset-password__form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <div class="reset-password__fields">
          <BaseTextField
            v-model="password"
            :error="!!passwordError"
            :max-length="128"
            :supporting-text="passwordError"
            :placeholder="t('auth.passwordLength')"
            :label="t('general.label.password')"
            :type="passwordType"
            :trailing-icon="
              password ? passwordIcon : undefined
            "
            @trailing-click="
              isPasswordVisible = !isPasswordVisible
            "
          />
          <BaseTextField
            v-model="confirmPassword"
            :error="!!confirmPasswordError"
            :max-length="128"
            :supporting-text="confirmPasswordError"
            :placeholder="t('auth.passwordLength')"
            :label="t('general.label.confirmPassword')"
            :type="passwordType"
            :trailing-icon="
              confirmPassword ? passwordIcon : undefined
            "
            @trailing-click="
              isPasswordVisible = !isPasswordVisible
            "
          />
        </div>

        <BaseButton
          class="submit-button"
          variant="accent"
          :loading="isLoading"
          type="submit"
          :label="t('general.action.save')"
        />
      </form>
      <BaseButton
        v-if="isSubmitted"
        class="back-button"
        :class="{
          'forgot-password__back-button--collapsed':
            isSubmitted,
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

.reset-password {
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

.reset-password__form {
  display: flex;
  width: 100%;
  gap: var(--space-32);
  margin-top: var(--space-32);
  flex-direction: column;
}

.reset-password__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.back-button {
  margin-top: var(--space-32);
}

.reset-password__message-icon {
  width: 60px;
  height: 60px;
  color: var(--text-muted);
  margin-bottom: var(--space-8);
}
</style>
