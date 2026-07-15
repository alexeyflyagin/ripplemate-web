import { postJson, postForm } from './client'
import type {
  RegisterRequest,
  User,
  LoginResponse,
} from './types'

export function register(
  data: RegisterRequest,
): Promise<User> {
  return postJson<User>('/auth/register', data)
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
