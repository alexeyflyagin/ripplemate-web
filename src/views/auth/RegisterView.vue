<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseTextField from '@/components/TextFields/BaseTextField.vue'
import BaseButton from '@/components/Buttons/BaseButton.vue'
import AuthHeader from './AuthHeader.vue'
import { useI18n } from 'vue-i18n'
import ShowIcon from '~icons/icons-16/show'
import ProfileIcon from '~icons/icons-16/profile'
import EmailIcon from '~icons/icons-16/email'
import HideIcon from '~icons/icons-16/hide'
import AuthSecondaryAction from './AuthSecondaryAction.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ApiError } from '@/api/client'

const { t } = useI18n()

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const isPasswordVisible = ref(false)

watch(name, () => {
  nameError.value = ''
})
watch(email, () => {
  emailError.value = ''
})
watch(password, () => {
  passwordError.value = ''
})
watch(confirmPassword, () => {
  confirmPasswordError.value = ''
})

const passwordType = computed(() =>
  isPasswordVisible.value ? 'text' : 'password',
)
const passwordIcon = computed(() =>
  isPasswordVisible.value ? ShowIcon : HideIcon,
)

function validate(): boolean {
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''

  let ok = true

  if (!name.value) {
    nameError.value = t('auth.validation.nameRequired')
    ok = false
  }

  if (!email.value) {
    emailError.value = t('auth.validation.emailRequired')
    ok = false
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = t('auth.validation.emailInvalid')
    ok = false
  }

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

async function handleSubmit() {
  if (!validate()) return

  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      display_name: name.value,
    })
    router.push('/')
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      emailError.value = t(
        'auth.validation.emailAlreadyExists',
      )
    } else {
      emailError.value = t(
        'general.error.somethingWentWrong',
      )
    }
  }
}
</script>

<template>
  <div class="register">
    <div class="content">
      <AuthHeader
        :title="t('appName')"
        :subtitle="t('auth.signupHeader')"
      />

      <form
        class="register__form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <div class="register__fields">
          <BaseTextField
            v-model="name"
            :max-length="32"
            :leading-icon="ProfileIcon"
            :error="!!nameError"
            :supporting-text="nameError"
            :label="t('general.label.whatIsYourName')"
          />
          <BaseTextField
            v-model="email"
            :max-length="254"
            :error="!!emailError"
            :leading-icon="EmailIcon"
            :supporting-text="emailError"
            :label="t('general.label.email')"
            type="email"
          />
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
          type="submit"
          :label="t('general.action.signup')"
        />
      </form>

      <AuthSecondaryAction
        class="secondary-action"
        :caption="t('auth.alreadyHaveAnAccount')"
        :link-label="t('general.action.login')"
        :to="{ name: 'login' }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-32);
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
  align-items: center;
  width: 100%;
  margin: var(--space-32) 0;
  max-width: var(--max-content-width-400);
}

.register__form {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: var(--space-32);
}

.register__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}
</style>
