export interface RegisterRequest {
  email: string
  password: string
  display_name: string
}

export interface User {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

export interface Category {
  id: number
  name: string
  created_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}
