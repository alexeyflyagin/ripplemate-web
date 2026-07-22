import { del, get, patchJson, postJson } from '../client'
import type {
  CardCreate,
  CardListResponse,
  CardRead,
  CardUpdate,
} from '../types'

export function createCard(
  workspaceId: number,
  data: CardCreate,
): Promise<CardRead> {
  return postJson<CardRead>(
    `/workspaces/${workspaceId}/cards`,
    data,
  )
}

export function getCards(
  workspaceId: number,
  categoryId?: number | null,
  search?: string | null,
  limit?: number | null,
  offset?: number | null,
): Promise<CardListResponse> {
  const params = new URLSearchParams()

  if (categoryId != null)
    params.set('category_id', String(categoryId))
  if (search != null) params.set('search', search)
  if (limit != null) params.set('limit', String(limit))
  if (offset != null) params.set('offset', String(offset))

  const query = params.toString()
  const path = `/workspaces/${workspaceId}/cards${query ? `?${query}` : ''}`

  return get<CardListResponse>(path)
}

export function getRandomCard(
  workspaceId: number,
  categoryId?: number | null,
): Promise<CardRead> {
  const params = new URLSearchParams()

  if (categoryId != null)
    params.set('category_id', String(categoryId))

  const query = params.toString()
  const path = `/workspaces/${workspaceId}/cards/random${query ? `?${query}` : ''}`

  return get<CardRead>(path)
}

export function getCard(
  workspaceId: number,
  cardId: number,
): Promise<CardRead> {
  return get<CardRead>(
    `/workspaces/${workspaceId}/cards/${cardId}`,
  )
}

export function updateCard(
  workspaceId: number,
  cardId: number,
  data: CardUpdate,
): Promise<CardRead> {
  return patchJson<CardRead>(
    `/workspaces/${workspaceId}/cards/${cardId}`,
    data,
  )
}

export function deleteCard(
  workspaceId: number,
  cardId: number,
): Promise<void> {
  return del(`/workspaces/${workspaceId}/cards/${cardId}`)
}
