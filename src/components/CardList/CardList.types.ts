export type CardPosition =
  | 'first'
  | 'middle'
  | 'last'
  | 'only-one'

export interface CardItemData {
  id: number
  term: string
  timeLabel: string
  isFavorite?: boolean
}

export interface CardGroupData {
  groupLabel: string
  items: CardItemData[]
}
