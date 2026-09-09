import { useDateFormat, useIntervalFn } from '@vueuse/core'
import { computed, ref } from 'vue'
import type { ComposerTranslation } from 'vue-i18n'

export function useResendButtonWithTimer(
  t: ComposerTranslation,
  seconds: number,
) {
  const timer = ref<number>(0)

  const isResendDisabled = ref<boolean>(false)

  const formattedTimer = useDateFormat(
    () => new Date(timer.value * 1000),
    'mm:ss',
  )

  const { pause, resume } = useIntervalFn(
    () => {
      if (timer.value > 0) {
        timer.value--
      } else {
        pause()
        isResendDisabled.value = false
      }
    },
    1000,
    { immediate: false },
  )

  const resendLabel = computed<string>(() => {
    return isResendDisabled.value
      ? t('general.action.resendIn', {
          timer: formattedTimer.value,
        })
      : t('general.action.resend')
  })

  function startTimer() {
    timer.value = seconds
    isResendDisabled.value = true
    resume()
  }

  return { resendLabel, isResendDisabled, startTimer }
}
