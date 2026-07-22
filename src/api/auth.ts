import { postJson, postForm } from './client'
import type {
  UserCreate,
  UserRead,
  LoginResponse,
} from './types'

export function register(
  data: UserCreate,
): Promise<UserRead> {
  return postJson<UserRead>('/auth/register', data)
}

export function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return postForm<LoginResponse>('/auth/jwt/login', {
    username: email,
    password,
  })
}
