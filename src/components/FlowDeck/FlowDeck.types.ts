export type AnswerType = 'easy' | 'good' | 'hard' | 'again'
export type CardState = 'initial' | 'pending' | 'answered'

export interface FlowCardData {
  card_id: number
  term: string
}
