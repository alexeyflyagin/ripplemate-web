import i18n from '@/i18n'
import type { ComposerTranslation } from 'vue-i18n'

export function useDate() {
  function parseBackendDate(isoString: string): Date {
    const normalized = isoString.replace(
      /(\.\d{3})\d*$/,
      '$1',
    )
    const withZ = normalized.endsWith('Z')
      ? normalized
      : normalized + 'Z'
    return new Date(withZ)
  }

  function isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    )
  }

  function getLocalTime(isoString: string): string {
    const date = parseBackendDate(isoString)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  function getYear(isoString: string): number {
    const date = parseBackendDate(isoString)
    return date.getFullYear()
  }

  function formatMonthDay(
    isoString: string,
    t: ComposerTranslation,
  ): string {
    const date = parseBackendDate(isoString)
    const now = new Date()

    if (isSameDay(date, now)) {
      return t('general.date.today')
    }

    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (isSameDay(date, yesterday)) {
      return t('general.date.yesterday')
    }

    const currentYear = now.getFullYear()
    const isCurrentYear = date.getFullYear() === currentYear

    return date.toLocaleDateString(
      i18n.global.locale.value,
      {
        month: 'long',
        day: 'numeric',
        year: isCurrentYear ? undefined : 'numeric',
      },
    )
  }

  return {
    parseBackendDate,
    getLocalTime,
    getYear,
    formatMonthDay,
    isSameDay,
  }
}
