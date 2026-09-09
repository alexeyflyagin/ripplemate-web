import {
  computed,
  readonly,
  ref,
  type Component,
  type Ref,
} from 'vue'
import ShowIcon from '~icons/icons-16/show'
import HideIcon from '~icons/icons-16/hide'

export function usePasswordShowHide(
  modelValue: Ref<string>,
) {
  const showPassword = ref<boolean>(false)
  const inputType = computed<'text' | 'password'>(() => {
    return showPassword.value ? 'text' : 'password'
  })
  const passwordIcon = computed<Component | undefined>(
    () => {
      if (!modelValue.value) return undefined
      return showPassword.value ? ShowIcon : HideIcon
    },
  )

  const onShowPassword = () =>
    (showPassword.value = !showPassword.value)

  return {
    passwordIcon: passwordIcon,
    inputType: inputType,
    showPassword: readonly(showPassword),
    onShowPassword,
  }
}
