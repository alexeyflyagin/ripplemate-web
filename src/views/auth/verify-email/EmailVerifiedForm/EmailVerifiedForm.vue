<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/domain/account/index.ts'
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/domain/auth/index.ts'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const accountStore = useAccountStore()

const loading = ref<boolean>(false)

async function onSubmit() {
  if (loading.value) return
  loading.value = true
  try {
    await authStore.initializeUserData()
    router.replace({ name: 'root' })
  } finally {
    loading.value = false
  }
}

watch(
  () => accountStore.account?.is_verified,
  (v) => {
    if (!v) router.replace({ name: 'verify-email' })
  },
  { immediate: true },
)
</script>

<template>
  <div class="email-verified-form">
    <span
      class="email-verified-form__emoji"
      aria-hidden="true"
      >🎉</span
    >

    <AuthHeader
      class="email-verified-form__header"
      :title="t('auth.verifyEmail.congratulations')"
      :subtitle="t('auth.verifyEmail.youAreAllSet')"
    />

    <BaseButton
      class="email-verified-form__sumbit"
      :label="t('general.action.letsGetStarted')"
      :loading="loading"
      variant="accent"
      @click="onSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
.email-verified-form {
  display: flex;
  flex-direction: column;

  &__emoji {
    font-size: 52px;
    align-self: center;
    margin-bottom: var(--space-32);
  }

  &__sumbit {
    margin-top: var(--space-32);
  }
}
</style>
