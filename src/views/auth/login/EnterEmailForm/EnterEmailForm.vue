<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { MAX_EMAIL_LENGTH } from '../../AuthView.constants.ts'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/domain/auth/index.ts'
import { computed, onMounted, ref, watch } from 'vue'
import { validateEmail } from '@/utils/validations.ts'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const emailFieldRef =
  ref<InstanceType<typeof BaseTextField>>()

const email = computed<string>({
  get() {
    const value = route.query.email
    return typeof value === 'string' ? value : ''
  },
  set(value: string) {
    router.replace({
      query: { ...route.query, email: value.trim() },
    })
  },
})

const emailError = ref<string>('')

const loading = ref<boolean>(false)

async function onSubmit() {
  if (loading.value) return
  loading.value = true

  if (!email.value) {
    emailError.value = t('auth.error.emailRequired')
    emailFieldRef.value?.focusInput()
    loading.value = false
    return
  }

  if (!validateEmail(email.value)) {
    emailError.value = t('auth.error.emailInvalid')
    emailFieldRef.value?.focusInput()
    loading.value = false
    return
  }
  try {
    const res = await authStore.exists(email.value)
    router.push({
      name: res.exists ? 'auth' : 'register',
      query: res.exists
        ? { email: email.value, password: '' }
        : { email: email.value, name: '' },
    })
  } catch {
    emailError.value = t('general.error.somethingWentWrong')
    emailFieldRef.value?.focusInput()
  } finally {
    loading.value = false
  }
}

watch(email, () => {
  if (emailError.value) emailError.value = ''
})

onMounted(async () => {
  emailFieldRef.value?.focusInput()
})
</script>

<template>
  <form
    class="enter-email-form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <AuthHeader
      class="enter-email-form__header"
      :subtitle="t('auth.login.enterEmail')"
    />

    <BaseTextField
      ref="emailFieldRef"
      class="enter-email-form__email"
      :label="t('general.label.email')"
      :max-length="MAX_EMAIL_LENGTH"
      v-model:model-value="email"
      type="email"
      :error="!!emailError"
      :supporting-text="emailError"
    />

    <BaseButton
      class="enter-email-form__submit"
      :label="t('general.action.letsGo')"
      variant="accent"
      :loading="loading"
      type="submit"
    />
  </form>
</template>

<style lang="scss" scoped>
.enter-email-form {
  display: flex;
  flex-direction: column;

  &__header {
    margin-bottom: var(--space-32);
  }

  &__submit {
    margin-top: var(--space-32);
  }
}
</style>
