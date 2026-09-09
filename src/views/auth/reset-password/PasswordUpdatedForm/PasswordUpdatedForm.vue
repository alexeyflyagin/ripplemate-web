<script setup lang="ts">
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

async function onSubmit() {
  router.replace({ name: 'root' })
}
</script>

<template>
  <div class="password-updated-form">
    <span
      class="password-updated-form__emoji"
      aria-hidden="true"
      >✅</span
    >

    <AuthHeader
      class="password-updated-form__header"
      :title="t('auth.resetPassword.passwordUpdated')"
    />

    <BaseButton
      class="password-updated-form__submit"
      :label="t('general.action.back')"
      @click="onSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
.password-updated-form {
  display: flex;
  flex-direction: column;

  &__emoji {
    font-size: 52px;
    align-self: center;
    margin-bottom: var(--space-32);
  }

  &__submit {
    margin-top: var(--space-32);
  }
}
</style>
