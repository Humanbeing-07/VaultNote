import {
  useState,
  type FormEvent,
} from 'react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    login,
    loading: authLoading,
  } = useAuth()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState<string | null>(null)

  const [submitting, setSubmitting] =
    useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError(null)

    const trimmedEmail =
      email.trim().toLowerCase()

    if (!trimmedEmail) {
      setError(
        'Email is required.'
      )
      return
    }

    if (!password) {
      setError(
        'Password is required.'
      )
      return
    }

    try {
      setSubmitting(true)

      await login(
        trimmedEmail,
        password
      )

      const state =
        location.state as
          | {
              from?: string
            }
          | null

      const destination =
        state?.from || '/dashboard'

      navigate(
        destination,
        {
          replace: true,
        }
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading =
    authLoading || submitting

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',

        background:
          'radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 35%), #080b12',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
        }}
      >
        {/* Logo */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '58px',
              height: '58px',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 14px',

              borderRadius: '16px',

              background:
                'rgba(99,102,241,0.14)',

              border:
                '1px solid rgba(99,102,241,0.25)',

              fontSize: '27px',
            }}
          >
            🔐
          </div>

          <h1
            style={{
              margin: 0,
              color: '#f9fafb',
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            VaultNote
          </h1>

          <p
            style={{
              margin:
                '8px 0 0',
              color: '#9ca3af',
              fontSize: '13px',
            }}
          >
            Your private notes,
            securely encrypted.
          </p>
        </div>

        {/* Login Card */}

        <div
          className="vault-card"
          style={{
            padding: '26px',
          }}
        >
          <div
            style={{
              marginBottom: '22px',
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: '6px',
                color: '#f9fafb',
                fontSize: '20px',
              }}
            >
              Welcome back
            </h2>

            <p
              style={{
                margin: 0,
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Sign in to access
              your secure vault.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            {/* Email */}

            <div
              style={{
                marginBottom: '18px',
              }}
            >
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#d1d5db',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Email
              </label>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                className="vault-input"
              />
            </div>

            {/* Password */}

            <div
              style={{
                marginBottom: '18px',
              }}
            >
              <label
                htmlFor="login-password"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#d1d5db',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Password
              </label>

              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                className="vault-input"
              />
            </div>

            {/* Error */}

            {error && (
              <div
                className="vault-error"
                style={{
                  marginBottom: '18px',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={isLoading}
              className="vault-button"
              style={{
                width: '100%',
                minHeight: '44px',
              }}
            >
              {isLoading
                ? 'Signing in...'
                : 'Sign In'}
            </button>
          </form>

          {/* Register */}

          <div
            style={{
              marginTop: '22px',
              paddingTop: '18px',
              borderTop:
                '1px solid #252d3d',

              textAlign: 'center',

              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            Don't have an account?{' '}

            <Link
              to="/register"
              style={{
                color: '#818cf8',
                fontWeight: 600,
              }}
            >
              Create one
            </Link>
          </div>
        </div>

        {/* Security message */}

        <div
          style={{
            marginTop: '18px',
            textAlign: 'center',
            color: '#586174',
            fontSize: '11px',
            lineHeight: 1.5,
          }}
        >
          🔒 VaultNote is designed
          around client-side
          encryption and privacy.
        </div>
      </div>
    </main>
  )
}