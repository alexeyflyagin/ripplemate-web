import { get, patchJson } from './client'
import type {
  AccountRead,
  SettingsRead,
  SettingsUpdate,
} from './types'

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
