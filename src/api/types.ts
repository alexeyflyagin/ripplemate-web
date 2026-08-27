export const FONTS = ['serif', 'sans-serif'] as const
export type Font = (typeof FONTS)[number]

export const LOCALES = ['auto', 'en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

export const THEMES = ['auto', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

export interface UserCreate {
  email: string
  password: string
  display_name: string
}

export interface UserRead {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface AccountRead {
  id: number
  display_name: string
  created_at: string
}

// Card
export interface CardCreate {
  term: string
  category_id?: string | null
}

export interface CardRead {
  id: number
  term: string
  category_id: string | null
  created_at: string
  is_favorite: boolean
}

export interface CardUpdate {
  term?: string | null
  category_id?: string | null
  is_favorite?: boolean | null
}

export interface CardListResponse {
  items: CardRead[]
  total: number
  limit: number
  offset: number
}

// Category
export interface CategoryCreate {
  name: string
}

export interface CategoryRead {
  id: string
  name: string
  created_at: string
}

export interface CategoryUpdate {
  name?: string | null
}

// Settings
export interface SettingsRead {}

export interface SettingsUpdate {}

// Workspace
export interface WorkspaceCreate {
  name: string
}

export interface WorkspaceRead {
  id: string
  name: string
  created_at: string
}

export interface WorkspaceUpdate {
  name?: string | null
}
