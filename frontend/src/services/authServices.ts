import type { User } from '../types/user'
import {
  generateSalt,
  saltToBase64,
} from '../utils/crypto'

const API_BASE_URL =
  'http://localhost:5000/api'

const AUTH_STORAGE_KEY =
  'vaultnote_auth_user'

const AUTH_TOKEN_KEY =
  'vaultnote_auth_token'

type AuthResponse = {
  success: boolean
  token?: string
  user?: {
    id: number | string
    email: string
    encryptionSalt?: string
  }
  message?: string
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }
  )

  const data = await response.json()

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || 'Request failed'
    )
  }

  return data
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const trimmedName = name.trim()

  const trimmedEmail =
    email.trim().toLowerCase()

  if (!trimmedName) {
    throw new Error(
      'Name is required.'
    )
  }

  if (!trimmedEmail) {
    throw new Error(
      'Email is required.'
    )
  }

  if (password.length < 8) {
    throw new Error(
      'Password must contain at least 8 characters.'
    )
  }

  const salt = generateSalt()

  const encryptionSalt =
    saltToBase64(salt)

  const data =
    await apiRequest<AuthResponse>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      }
    )

  if (!data.user) {
    throw new Error(
      'Registration response is missing user data.'
    )
  }

  const finalSalt =
    data.user.encryptionSalt ||
    encryptionSalt

  const user: User = {
    id: String(data.user.id),
    name: trimmedName,
    email: data.user.email,
    createdAt:
      new Date().toISOString(),
    encryptionSalt: finalSalt,
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(user)
  )

  return user
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const trimmedEmail =
    email.trim().toLowerCase()

  if (!trimmedEmail) {
    throw new Error(
      'Email is required.'
    )
  }

  if (!password) {
    throw new Error(
      'Password is required.'
    )
  }

  const data =
    await apiRequest<AuthResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      }
    )

  if (!data.user) {
    throw new Error(
      'Login response is missing user data.'
    )
  }

  if (!data.user.encryptionSalt) {
    throw new Error(
      'Encryption salt is missing.'
    )
  }

  if (!data.token) {
    throw new Error(
      'Authentication token is missing.'
    )
  }

  // IMPORTANT:
  // Same key used by api.ts
  localStorage.setItem(
    AUTH_TOKEN_KEY,
    data.token
  )

  const authenticatedUser: User = {
    id: String(data.user.id),
    name:
      trimmedEmail.split('@')[0],
    email: data.user.email,
    createdAt:
      new Date().toISOString(),
    encryptionSalt:
      data.user.encryptionSalt,
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(
      authenticatedUser
    )
  )

  return authenticatedUser
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem(
    AUTH_STORAGE_KEY
  )

  localStorage.removeItem(
    AUTH_TOKEN_KEY
  )
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const data =
      localStorage.getItem(
        AUTH_STORAGE_KEY
      )

    if (!data) {
      return null
    }

    return JSON.parse(data) as User
  } catch {
    localStorage.removeItem(
      AUTH_STORAGE_KEY
    )

    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user =
    await getCurrentUser()

  return user !== null
}