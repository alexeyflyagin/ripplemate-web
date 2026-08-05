export type CardPosition =
  | 'first'
  | 'middle'
  | 'last'
  | 'only-one'

export interface CardItemData {
  type: 'card'
  id: number
  term: string
  timeLabel: string
  isFavorite?: boolean
  position?: CardPosition
}

export interface CardGroupLabelData {
  type: 'label'
  key: string
  label: string
}

export interface SpacerData {
  type: 'top-spacer' | 'bottom-spacer'
}
