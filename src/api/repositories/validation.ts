import { postJson } from '@/api/client'
import type { ValidationMessageResponse } from '@/api/types'

export function requestResetPassword(email: string) {
  return postJson<ValidationMessageResponse>(
    '/validation/request-reset-password',
    {
      email,
    },
  )
}

export function resetPassword(
  token: string,
  password: string,
) {
  return postJson<ValidationMessageResponse>(
    '/validation/reset-password',
    {
      token,
      password,
    },
  )
}

export function requestVerifyEmail(email: string) {
  return postJson<ValidationMessageResponse>(
    '/validation/request-verify-email',
    {
      email,
    },
  )
}

export function verifyEmail(token: string) {
  return postJson<ValidationMessageResponse>(
    '/validation/verify-email',
    {
      token,
    },
  )
}
