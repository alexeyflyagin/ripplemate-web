import { useI18n } from 'vue-i18n'

export function useDate() {
  const { locale, t } = useI18n()

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

  function monthAndDay(date: Date): string {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (isSameDay(date, today))
      return t('general.date.today')
    if (isSameDay(date, yesterday))
      return t('general.date.yesterday')

    return new Intl.DateTimeFormat(locale.value, {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  function timeHHmm(date: Date): string {
    const h = date.getHours()
    const m = date.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
  }

  function toISODate(date: Date): string {
    const y = date.getFullYear()
    const m = (date.getMonth() + 1)
      .toString()
      .padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  return {
    parseBackendDate,
    monthAndDay,
    timeHHmm,
    toISODate,
  }
}
