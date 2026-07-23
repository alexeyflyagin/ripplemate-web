export function getRect(event: MouseEvent) {
  return (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect()
}
