import { useState } from 'react'

import type {
  SharePermission,
} from '../types/sharing'

type ShareModalProps = {
  isOpen: boolean
  noteId: string
  loading?: boolean
  onClose: () => void
  onShare: (
    email: string,
    permission: SharePermission
  ) => Promise<void> | void
}

export default function ShareModal({
  isOpen,
  noteId,
  loading = false,
  onClose,
  onShare,
}: ShareModalProps) {
  const [email, setEmail] =
    useState('')

  const [permission, setPermission] =
    useState<SharePermission>('view')

  const [error, setError] =
    useState<string | null>(null)

  if (!isOpen) {
    return null
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const trimmedEmail =
      email.trim().toLowerCase()

    if (!trimmedEmail) {
      setError(
        'Recipient email is required.'
      )
      return
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(trimmedEmail)) {
      setError(
        'Please enter a valid email address.'
      )
      return
    }

    if (!noteId) {
      setError(
        'Note ID is missing.'
      )
      return
    }

    try {
      setError(null)

      await onShare(
        trimmedEmail,
        permission
      )

      setEmail('')
      setPermission('view')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to share note.'
      )
    }
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background:
          'rgba(0, 0, 0, 0.65)',
      }}
    >
      <div
        className="vault-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-note-title"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent:
              'space-between',
            gap: '16px',
            marginBottom: '22px',
          }}
        >
          <div>
            <h2
              id="share-note-title"
              style={{
                margin: 0,
                marginBottom: '6px',
                color: '#f9fafb',
                fontSize: '20px',
              }}
            >
              Share Secure Note
            </h2>

            <p
              style={{
                margin: 0,
                color: '#9ca3af',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              Share an encrypted note
              without exposing its
              plaintext to the server.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            style={{
              border: 'none',
              background:
                'transparent',
              color: '#9ca3af',
              fontSize: '24px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
        >
          <div
            style={{
              marginBottom: '18px',
            }}
          >
            <label
              htmlFor="recipient-email"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#d1d5db',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Recipient email
            </label>

            <input
              id="recipient-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="teammate@example.com"
              disabled={loading}
              autoComplete="email"
              className="vault-input"
            />
          </div>

          <div
            style={{
              marginBottom: '18px',
            }}
          >
            <label
              htmlFor="share-permission"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#d1d5db',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Permission
            </label>

            <select
              id="share-permission"
              value={permission}
              onChange={(event) =>
                setPermission(
                  event.target
                    .value as SharePermission
                )
              }
              disabled={loading}
              className="vault-input"
            >
              <option value="view">
                View only
              </option>

              <option value="edit">
                Can edit
              </option>
            </select>
          </div>

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

          <div
            style={{
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '9px',
              background:
                'rgba(99, 102, 241, 0.08)',
              border:
                '1px solid rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              fontSize: '12px',
              lineHeight: 1.5,
            }}
          >
            🔐 The note remains
            end-to-end encrypted.
            Only authorized users
            receive the encrypted
            key required to decrypt it.
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent:
                'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="vault-button-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="vault-button"
            >
              {loading
                ? 'Sharing...'
                : 'Share Securely'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}