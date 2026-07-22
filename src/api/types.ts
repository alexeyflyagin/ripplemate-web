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
  category_id?: number | null
}

export interface CardRead {
  id: number
  term: string
  category_id: number | null
  created_at: string
}

export interface CardUpdate {
  term?: string | null
  category_id?: number | null
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
  id: number
  name: string
  created_at: string
}

export interface CategoryUpdate {
  name?: string | null
}

// Settings
export interface SettingsRead {
  font: string
  language: string
  theme: string
}

export interface SettingsUpdate {
  font?: string | null
  language?: string | null
  theme?: string | null
}

// Workspace
export interface WorkspaceCreate {
  name: string
}

export interface WorkspaceRead {
  id: number
  name: string
  created_at: string
}

export interface WorkspaceUpdate {
  name?: string | null
}
