export type AnswerType = 'easy' | 'good' | 'hard' | 'again'
export type CardState = 'initial' | 'pending' | 'answered'
export type DeckState = 'card' | 'empty'

export interface FlowCardData {
  card_id: number
  term: string
}
