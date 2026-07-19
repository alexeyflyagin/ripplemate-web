export function isJWTTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return true

    const base64 = base64Url
      .replaceAll('-', '+')
      .replaceAll('_', '/')
    const payload = JSON.parse(atob(base64))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
