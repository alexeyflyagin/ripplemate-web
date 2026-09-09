<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { usePasswordShowHide } from '@/composables/usePasswordShowHide.ts'
import { MAX_PASSWORD_LENGTH } from '../../AuthView.constants.ts'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/domain/auth/index.ts'
import { ApiError } from '@/api/client.ts'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const passwordFieldRef =
  ref<InstanceType<typeof BaseTextField>>()

const email = computed<string>(() => {
  const value = route.query.email
  return typeof value === 'string' ? value.trim() : ''
})

const forgotPasswordLinkHtml = computed<string>(() => {
  const path = router.resolve({
    name: 'forgot-password',
    query: { email: email.value },
  })
  return `<a class="supporting-link" href="${path.href}">${t('general.action.resetPassword')}</a>`
})

const loading = ref<boolean>(false)

const password = ref<string>('')
const passwordError = ref<string>('')

const { inputType, onShowPassword, passwordIcon } =
  usePasswordShowHide(password)

async function onSubmit() {
  if (loading.value) return
  loading.value = true
  if (!password.value) {
    passwordError.value = t(
      'auth.error.passwordRequiredWithLink',
      {
        link: forgotPasswordLinkHtml.value,
      },
    )
    passwordFieldRef.value?.focusInput()
    loading.value = false
    return
  }

  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'root' })
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      passwordError.value = t('auth.error.wrongPassword', {
        link: forgotPasswordLinkHtml.value,
      })
    } else {
      passwordError.value = t(
        'general.error.somethingWentWrong',
      )
    }
    passwordFieldRef.value?.focusInput()
  } finally {
    loading.value = false
  }
}

watch(password, () => {
  if (passwordError.value) passwordError.value = ''
})

onMounted(() => {
  passwordFieldRef.value?.focusInput()
})
</script>

<template>
  <form
    class="enter-password-form"
    @submit.prevent="onSubmit"
  >
    <span
      class="enter-password-form__emoji"
      aria-hidden="true"
      >🙈</span
    >

    <AuthHeader
      class="enter-password-form__header"
      :title="t('auth.login.enterPassword')"
    />

    <BaseTextField
      ref="passwordFieldRef"
      class="enter-password-form__password"
      :label="t('general.label.password')"
      :max-length="MAX_PASSWORD_LENGTH"
      v-model:model-value="password"
      :error="!!passwordError"
      :supporting-text="passwordError"
      :type="inputType"
      :trailing-icon="passwordIcon"
      @trailing-click="onShowPassword"
    />

    <BaseButton
      class="enter-password-form__sumbit"
      :label="t('general.action.login')"
      :loading="loading"
      variant="accent"
      type="submit"
    />

    <BaseButton
      class="enter-password-form__back"
      :label="t('general.action.back')"
      @click="router.back"
    />
  </form>
</template>

<style lang="scss" scoped>
.enter-password-form {
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

  &__sumbit {
    margin-top: var(--space-32);
  }

  &__back {
    margin-top: var(--space-8);
  }
}
</style>
