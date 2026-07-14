<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseTextField from '../../components/BaseTextField.vue'
import BaseButton from '../../components/BaseButton.vue'
import AuthHeader from './AuthHeader.vue'
import { useI18n } from 'vue-i18n'
import ShowIcon from '~icons/icons-16/show'
import HideIcon from '~icons/icons-16/hide'
import EmailIcon from '~icons/icons-16/email'
import AuthSecondaryAction from './AuthSecondaryAction.vue'

const isPasswordVisible = ref(false)

const email = ref('')
const password = ref('')

const emailError = ref('')
const passwordError = ref('')

watch(email, () => {
  emailError.value = ''
})
watch(password, () => {
  passwordError.value = ''
})

const passwordType = computed(() =>
  isPasswordVisible.value ? 'text' : 'password',
)
const passwordIcon = computed(() =>
  isPasswordVisible.value ? ShowIcon : HideIcon,
)

const { t } = useI18n()

function validate(): boolean {
  emailError.value = ''
  passwordError.value = ''

  let ok = true

  if (!email.value) {
    emailError.value = t('auth.validation.emailRequired')
    ok = false
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = t('auth.validation.emailInvalid')
    ok = false
  }

  if (!password.value) {
    passwordError.value = t(
      'auth.validation.passwordRequired',
    )
    ok = false
  } else if (password.value.length < 8) {
    passwordError.value = t('auth.validation.wrongPassword')
  }

  return ok
}

function handleSubmit() {
  if (!validate()) return
  // TODO: send data to POST /auth/jwt/login
}
</script>

<template>
  <div class="login">
    <div class="content">
      <AuthHeader
        :title="t('appName')"
        :subtitle="t('auth.loginHeader')"
      />

      <form
        class="login__form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <div class="login__fields">
          <BaseTextField
            v-model="email"
            type="email"
            :max-length="254"
            :error="!!emailError"
            :leading-icon="EmailIcon"
            :supporting-text="emailError"
            :label="t('general.label.email')"
          />
          <BaseTextField
            v-model="password"
            :error="!!passwordError"
            :max-length="128"
            :supporting-text="passwordError"
            :label="t('general.label.password')"
            :type="passwordType"
            :trailing-icon="
              password ? passwordIcon : undefined
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
          :label="t('general.action.letsGo')"
        />
      </form>

      <AuthSecondaryAction
        class="secondary-action"
        :caption="t('auth.doNotHaveAnAccount')"
        :link-label="t('general.action.signup')"
        :to="{ name: 'register' }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
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
  max-width: var(--max-auth-content-width-400);
}

.login__form {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: var(--space-32);
}

.login__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}
</style>
