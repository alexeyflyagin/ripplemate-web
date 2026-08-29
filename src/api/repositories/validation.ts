import { postForm, postJson } from '@/api/client'
import type {
  ResetPassword,
  ResetPasswordRequest,
} from '@/api/types'

export function requestResetPassword(email: string) {
  return postJson<ResetPasswordRequest>(
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
  return postJson<ResetPassword>(
    '/validation/reset-password',
    {
      token,
      password,
    },
  )
}
