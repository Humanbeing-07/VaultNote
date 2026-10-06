import {
  useState,
  type FormEvent,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()

  const {
    register,
    loading: authLoading,
  } = useAuth()

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
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

    const trimmedName =
      name.trim()

    const trimmedEmail =
      email.trim().toLowerCase()

    if (!trimmedName) {
      setError(
        'Name is required.'
      )
      return
    }

    if (!trimmedEmail) {
      setError(
        'Email is required.'
      )
      return
    }

    if (password.length < 8) {
      setError(
        'Password must contain at least 8 characters.'
      )
      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      )
      return
    }

    try {
      setSubmitting(true)

      await register(
        trimmedName,
        trimmedEmail,
        password
      )

      navigate(
        '/dashboard',
        {
          replace: true,
        }
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed.'
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
          'radial-gradient(circle at top right, rgba(139,92,246,0.12), transparent 35%), #080b12',
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
            Create your private
            encrypted vault.
          </p>
        </div>

        {/* Register Card */}

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
              Create account
            </h2>

            <p
              style={{
                margin: 0,
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Start storing your
              private notes securely.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            {/* Name */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >
              <label
                htmlFor="register-name"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#d1d5db',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Full Name
              </label>

              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Your name"
                autoComplete="name"
                disabled={isLoading}
                className="vault-input"
              />
            </div>

            {/* Email */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >
              <label
                htmlFor="register-email"
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
                id="register-email"
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
                marginBottom: '16px',
              }}
            >
              <label
                htmlFor="register-password"
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
                id="register-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                disabled={isLoading}
                className="vault-input"
              />
            </div>

            {/* Confirm Password */}

            <div
              style={{
                marginBottom: '18px',
              }}
            >
              <label
                htmlFor="register-confirm-password"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#d1d5db',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Confirm Password
              </label>

              <input
                id="register-confirm-password"
                type="password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
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
                ? 'Creating account...'
                : 'Create Account'}
            </button>
          </form>

          {/* Login */}

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
            Already have an account?{' '}

            <Link
              to="/login"
              style={{
                color: '#818cf8',
                fontWeight: 600,
              }}
            >
              Sign in
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
          🔒 Your vault is designed
          with privacy and
          client-side encryption
          in mind.
        </div>
      </div>
    </main>
  )
}