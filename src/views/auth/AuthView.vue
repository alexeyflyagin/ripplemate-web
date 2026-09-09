<script setup lang="ts">
import { shallowRef, watch, type Component } from 'vue'
import EnterPasswordForm from './login/EnterPasswordForm/EnterPasswordForm.vue'
import EnterEmailForm from './login/EnterEmailForm/EnterEmailForm.vue'
import EnterNameForm from './register/EnterNameForm/EnterNameForm.vue'
import { useRoute } from 'vue-router'
import SetPasswordForm from './register/SetPasswordForm/SetPasswordForm.vue'
import { validateEmail } from '@/utils/validations.ts'
import VerifyEmailForm from './verify-email/VerifyEmailForm/VerifyEmailForm.vue'
import { useAccountStore } from '@/stores/domain/account/index.ts'
import EmailVerifiedForm from './verify-email/EmailVerifiedForm/EmailVerifiedForm.vue'
import VerifyResetCodeForm from './reset-password/VerifyResetCodeForm/VerifyResetCodeForm.vue'
import ResetPasswordForm from './reset-password/ResetPasswordForm/ResetPasswordForm.vue'
import PasswordUpdatedForm from './reset-password/PasswordUpdatedForm/PasswordUpdatedForm.vue'
import { BaseButton } from '@/components/ui/Button/BaseButton/index.ts'
import { useI18n } from 'vue-i18n'
import SettingIcon from '~icons/icons-16/setting'
import { useSettingsMenu } from './composables/useSettingsMenu.ts'

const { t } = useI18n()
const route = useRoute()
const accountStore = useAccountStore()

const currentView = shallowRef<Component>(EnterEmailForm)

const { open: openSettingsMenu } = useSettingsMenu(t)

watch(
  [route, () => accountStore.account?.is_verified],
  ([newRoute, isVerified]) => {
    const q = newRoute.query
    const name = newRoute.name
    let newView: Component = EnterEmailForm

    if (
      name === 'verify-email' &&
      isVerified !== undefined
    ) {
      newView = isVerified
        ? EmailVerifiedForm
        : VerifyEmailForm
    }

    if (
      name === 'auth' &&
      'email' in q &&
      'password' in q
    ) {
      newView = EnterPasswordForm
    }

    if (name === 'register' && 'email' in q) {
      if (
        typeof q.email === 'string' &&
        validateEmail(q.email)
      ) {
        if ('name' in q) newView = EnterNameForm
        if ('password' in q) newView = SetPasswordForm
      }
    }

    if (name == 'forgot-password' && 'email' in q) {
      newView = VerifyResetCodeForm
    }

    if (name == 'reset-password') {
      if ('token' in q) newView = ResetPasswordForm
      if ('token' in q && 'verified' in q)
        newView = PasswordUpdatedForm
    }

    currentView.value = newView
  },
  { immediate: true },
)
</script>

<template>
  <div class="auth-view">
    <div class="auth-view__content">
      <Transition name="fade" mode="out-in">
        <component class="current-view" :is="currentView" />
      </Transition>
    </div>
    <BaseButton
      class="auth-view__settings-button"
      :label="t('general.label.settings')"
      :icon="SettingIcon"
      @click="openSettingsMenu"
    />
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.auth-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  width: 100%;
  align-items: center;
  padding-top: calc(
    var(--space-64) + env(safe-area-inset-top)
  );
  padding-bottom: calc(
    var(--space-24) + env(safe-area-inset-bottom)
  );
}

.auth-view__content {
  display: flex;
  flex: 1 0 auto;
  min-height: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.current-view {
  width: 100%;
  max-width: var(--max-content-width-300);
  margin: 0 var(--space-24);
}

.auth-view__settings-button {
  flex-shrink: 0;
  margin-top: var(--space-24);
}
</style>
