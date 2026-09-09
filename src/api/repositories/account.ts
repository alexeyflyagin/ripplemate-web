import { get, patchJson } from '../client'
import type {
  AccountExists,
  AccountRead,
  SettingsRead,
  SettingsUpdate,
} from '../types'

export function exists(
  email: string,
): Promise<AccountExists> {
  const params = new URLSearchParams()
  params.set('email', email)
  return get<AccountExists>(
    `/account/exists?${params.toString()}`,
  )
}

export function getAccount(): Promise<AccountRead> {
  return get<AccountRead>('/account')
}

export function getSettings(): Promise<SettingsRead> {
  return get<SettingsRead>('/settings')
}

export function updateSettings(
  data: SettingsUpdate,
): Promise<SettingsRead> {
  return patchJson<SettingsRead>('/settings', data)
}
