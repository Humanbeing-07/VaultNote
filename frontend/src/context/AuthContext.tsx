import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { User } from '../types/user'

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/authServices'

import {
  deriveKey,
} from '../utils/crypto'

type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  encryptionKey: CryptoKey | null

  login: (
    email: string,
    password: string
  ) => Promise<User>

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<User>

  logout: () => Promise<void>
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  )

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [encryptionKey, setEncryptionKey] =
    useState<CryptoKey | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser =
          await getCurrentUser()

        setUser(currentUser)

        // Encryption key requires the user's
        // password, so it cannot be restored
        // automatically from local storage.
        setEncryptionKey(null)
      } catch (error) {
        console.error(
          'Failed to load current user:',
          error
        )

        setUser(null)
        setEncryptionKey(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function login(
    email: string,
    password: string
  ): Promise<User> {
    const authenticatedUser =
      await loginUser(
        email,
        password
      )

    if (
      !authenticatedUser.encryptionSalt
    ) {
      throw new Error(
        'Encryption salt is missing'
      )
    }

    const saltBytes =
      Uint8Array.from(
        atob(
          authenticatedUser.encryptionSalt
        ),
        char => char.charCodeAt(0)
      )

    const key =
      await deriveKey(
        password,
        saltBytes
      )

    setEncryptionKey(key)
    setUser(authenticatedUser)

    return authenticatedUser
  }

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const registeredUser =
      await registerUser(
        name,
        email,
        password
      )

    if (
      !registeredUser.encryptionSalt
    ) {
      throw new Error(
        'Encryption salt is missing'
      )
    }

    const saltBytes =
      Uint8Array.from(
        atob(
          registeredUser.encryptionSalt
        ),
        char => char.charCodeAt(0)
      )

    const key =
      await deriveKey(
        password,
        saltBytes
      )

    setEncryptionKey(key)
    setUser(registeredUser)

    return registeredUser
  }

  async function logout(): Promise<void> {
    await logoutUser()

    setEncryptionKey(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated:
      user !== null,
    encryptionKey,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}