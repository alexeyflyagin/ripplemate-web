<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { usePasswordShowHide } from '@/composables/usePasswordShowHide.ts'
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../AuthView.constants.ts'
import { useRoute, useRouter } from 'vue-router'
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useAuthStore } from '@/stores/domain/auth/index.ts'
import { ApiError } from '@/api/client.ts'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref<boolean>(false)

const email = computed<string>(() => {
  const value = route.query.email
  return typeof value === 'string' ? value.trim() : ''
})

const name = computed<string>(() => {
  const value = route.query.name
  return typeof value === 'string' ? value.trim() : ''
})

const passwordFieldRef =
  ref<InstanceType<typeof BaseTextField>>()
const confirmPasswordFieldRef =
  ref<InstanceType<typeof BaseTextField>>()

const password = ref<string>('')
const confirmPassword = ref<string>('')

const passwordError = ref<string>('')
const confirmPasswordError = ref<string>('')

const { inputType, onShowPassword, passwordIcon } =
  usePasswordShowHide(password)

async function onSubmit() {
  if (loading.value) return
  loading.value = true

  if (!password.value) {
    passwordError.value = t('auth.error.passwordRequired')
    passwordFieldRef.value?.focusInput()
    loading.value = false
    return
  }

  if (
    password.value &&
    password.value.length < MIN_PASSWORD_LENGTH
  ) {
    passwordError.value = t('auth.error.passwordTooShort')
    passwordFieldRef.value?.focusInput()
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = t(
      'auth.error.passwordsDoNotMatch',
    )
    confirmPasswordFieldRef.value?.focusInput()
    loading.value = false
    return
  }

  try {
    await authStore.register({
      display_name: name.value,
      email: email.value,
      password: password.value,
    })
    router.push({ name: 'root' })
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      confirmPasswordError.value = t(
        'auth.validation.emailAlreadyExists',
      )
    } else {
      confirmPasswordError.value = t(
        'general.error.somethingWentWrong',
      )
    }
  } finally {
    loading.value = false
  }
}

watch(
  [() => password.value, () => confirmPassword.value],
  ([newPassword, newPasswordConfirm]) => {
    passwordError.value = ''
    confirmPasswordError.value = ''

    if (
      newPassword &&
      newPassword.length < MIN_PASSWORD_LENGTH
    ) {
      passwordError.value = t('auth.error.passwordTooShort')
    }

    if (
      newPasswordConfirm &&
      newPassword !== newPasswordConfirm
    ) {
      confirmPasswordError.value = t(
        'auth.error.passwordsDoNotMatch',
      )
    }
  },
  { immediate: true },
)

onMounted(() => {
  passwordFieldRef.value?.focusInput()
})
</script>

<template>
  <form
    class="set-password-form"
    @submit.prevent="onSubmit"
  >
    <span
      class="set-password-form__emoji"
      aria-hidden="true"
      >🙈</span
    >

    <AuthHeader
      class="set-password-form__header"
      :title="t('auth.register.setPassword')"
    />

    <BaseTextField
      ref="passwordFieldRef"
      class="set-password-form__password"
      :label="t('general.label.password')"
      :max-length="MAX_PASSWORD_LENGTH"
      :placeholder="t('auth.passwordHint')"
      v-model:model-value="password"
      :type="inputType"
      :error="!!passwordError"
      :supporting-text="passwordError"
      :trailing-icon="passwordIcon"
      @trailing-click="onShowPassword"
    />

    <BaseTextField
      class="set-password-form__confirm-password"
      :label="t('general.label.confirmPassword')"
      :max-length="MAX_PASSWORD_LENGTH"
      v-model:model-value="confirmPassword"
      :type="inputType"
      :error="!!confirmPasswordError"
      :supporting-text="confirmPasswordError"
      :trailing-icon="passwordIcon"
      @trailing-click="onShowPassword"
    />

    <BaseButton
      class="set-password-form__sumbit"
      :label="t('general.action.continue')"
      :loading="loading"
      variant="accent"
      type="submit"
    />

    <BaseButton
      class="set-password-form__back"
      :label="t('general.action.back')"
      @click="router.back"
    />
  </form>
</template>

<style lang="scss" scoped>
.set-password-form {
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

  &__confirm-password {
    margin-top: var(--space-8);
  }

  &__sumbit {
    margin-top: var(--space-32);
  }

  &__back {
    margin-top: var(--space-8);
  }
}
</style>
