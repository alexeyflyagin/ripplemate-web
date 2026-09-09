import { postJson } from '@/api/client'
import type {
  ResetCodeConfirmed,
  ResetPassword,
  ResetPasswordRequest,
  ValidationMessageResponse,
  VerifyEmail,
  VerifyEmailRequest,
  VerifyResetCode,
} from '@/api/types'

export function requestResetPassword(
  data: ResetPasswordRequest,
) {
  return postJson<ValidationMessageResponse>(
    '/validation/request-reset-password',
    {
      email: data.email,
    },
  )
}

export function resetPassword(data: ResetPassword) {
  return postJson<ValidationMessageResponse>(
    '/validation/reset-password',
    data,
  )
}

export function verifyResetCode(data: VerifyResetCode) {
  return postJson<ResetCodeConfirmed>(
    '/validation/verify-reset-code',
    data,
  )
}

export function requestVerifyEmail(
  data: VerifyEmailRequest,
) {
  return postJson<ValidationMessageResponse>(
    '/validation/request-verify-email',
    data,
  )
}

export function verifyEmail(data: VerifyEmail) {
  return postJson<ValidationMessageResponse>(
    '/validation/verify-email',
    data,
  )
}
