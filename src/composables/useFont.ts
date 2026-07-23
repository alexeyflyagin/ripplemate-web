export const FONTS = ['serif', 'sans-serif'] as const
export type Font = (typeof FONTS)[number]

export function applyFont(font: Font) {
  const variable =
    font === 'serif' ? '--font-serif' : '--font-sans'
  document.documentElement.style.setProperty(
    '--font-current',
    `var(${variable})`,
  )
}
