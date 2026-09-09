<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { BaseButton } from '@/components/ui/Button/BaseButton'
import { BaseTextField } from '@/components/ui/TextField/BaseTextField'
import { useI18n } from 'vue-i18n'
import AuthHeader from '../../AuthHeader.vue'
import { emailLinkHtml } from '@/utils/emailLink'
import ProfileIcon from '~icons/icons-16/profile'
import { MAX_NAME_LENGTH } from '../../AuthView.constants.ts'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const nameFieldRef =
  ref<InstanceType<typeof BaseTextField>>()

const email = computed<string>(() => {
  const qemail = route.query.email
  return typeof qemail === 'string' ? qemail : ''
})

const emailHtml = computed(() => emailLinkHtml(email.value))

const name = computed<string>({
  get() {
    const value = route.query.name
    return typeof value === 'string' ? value : ''
  },
  set(value: string) {
    router.replace({
      query: { ...route.query, name: value.trim() },
    })
  },
})
const nameError = ref<string>('')

function onSubmit() {
  if (!name.value) {
    nameError.value = t('auth.error.nameRequired')
    nameFieldRef.value?.focusInput()
    return
  }

  router.push({
    query: { ...route.query, password: '' },
  })
}

watch(name, () => {
  if (nameError.value) nameError.value = ''
})

onMounted(() => {
  nameFieldRef.value?.focusInput()
})
</script>

<template>
  <form class="enter-name-form" @submit.prevent="onSubmit">
    <span class="enter-name-form__emoji" aria-hidden="true"
      >👋</span
    >

    <AuthHeader
      class="enter-name-form__header"
      :title="t('auth.register.createAccount')"
      :subtitle="
        t('auth.register.youAreNewHere', {
          email: emailHtml,
        })
      "
    />

    <BaseTextField
      ref="nameFieldRef"
      class="enter-name-form__name"
      :leading-icon="ProfileIcon"
      :max-length="MAX_NAME_LENGTH"
      :error="!!nameError"
      :supporting-text="nameError"
      :label="t('general.label.whatIsYourName')"
      v-model:model-value="name"
    />

    <BaseButton
      class="enter-name-form__submit"
      :label="t('general.action.next')"
      variant="accent"
      type="submit"
    />

    <BaseButton
      class="enter-name-form__back"
      :label="t('general.action.back')"
      @click="router.back"
    />
  </form>
</template>

<style lang="scss" scoped>
.enter-name-form {
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

  &__submit {
    margin-top: var(--space-32);
  }

  &__back {
    margin-top: var(--space-8);
  }
}
</style>
