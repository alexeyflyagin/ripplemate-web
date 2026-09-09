import { escapeHtml } from './escapeHtml'

export function emailLinkHtml(
  email: string,
  className = 'email-link',
): string {
  const safeEmail = escapeHtml(email)
  return `<a class="${className}" href="mailto:${safeEmail}">${safeEmail}</a>`
}
