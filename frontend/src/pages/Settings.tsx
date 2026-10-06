import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user } = useAuth()

  const [message, setMessage] =
    useState<string | null>(null)

  const [autoLock, setAutoLock] =
    useState(true)

  const [shareNotifications, setShareNotifications] =
    useState(true)

  function saveSettings() {
    setMessage(
      'Settings saved successfully.'
    )

    window.setTimeout(() => {
      setMessage(null)
    }, 2500)
  }

  return (
    <main className="vault-page">
      {/* Header */}

      <header
        style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          borderBottom:
            '1px solid #252d3d',
          background:
            'rgba(8, 11, 18, 0.92)',
        }}
      >
        <Link
          to="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          <span>🔐</span>
          <span>VaultNote</span>
        </Link>

        <Link
          to="/dashboard"
          className="vault-button-secondary"
        >
          Dashboard
        </Link>
      </header>

      {/* Main */}

      <section
        className="vault-container"
        style={{
          maxWidth: '850px',
          paddingTop: '36px',
          paddingBottom: '60px',
        }}
      >
        {/* Heading */}

        <div
          style={{
            marginBottom: '26px',
          }}
        >
          <p
            style={{
              margin: '0 0 7px',
              color: '#818cf8',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            ACCOUNT
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: '28px',
            }}
          >
            Settings
          </h1>

          <p
            style={{
              margin:
                '8px 0 0',
              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            Manage your VaultNote
            preferences and security.
          </p>
        </div>

        {/* Success */}

        {message && (
          <div
            className="vault-success"
            style={{
              marginBottom: '18px',
            }}
          >
            ✓ {message}
          </div>
        )}

        {/* Account */}

        <section
          className="vault-card"
          style={{
            padding: '22px',
            marginBottom: '18px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 18px',
              fontSize: '17px',
            }}
          >
            Account information
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '15px',
            }}
          >
            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '11px',
                  marginBottom: '6px',
                }}
              >
                NAME
              </div>

              <div
                style={{
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              >
                {user?.name ||
                  'Not available'}
              </div>
            </div>

            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '11px',
                  marginBottom: '6px',
                }}
              >
                EMAIL
              </div>

              <div
                style={{
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              >
                {user?.email ||
                  'Not available'}
              </div>
            </div>
          </div>
        </section>

        {/* Security */}

        <section
          className="vault-card"
          style={{
            padding: '22px',
            marginBottom: '18px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 18px',
              fontSize: '17px',
            }}
          >
            Security
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '18px',
            }}
          >
            {/* Encryption */}

            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
                gap: '20px',
                paddingBottom:
                  '16px',
                borderBottom:
                  '1px solid #252d3d',
              }}
            >
              <div>
                <h3
                  style={{
                    margin:
                      '0 0 5px',
                    fontSize: '14px',
                  }}
                >
                  End-to-end
                  encryption
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: '#6b7280',
                    fontSize: '12px',
                  }}
                >
                  Encryption status
                  for your private
                  vault.
                </p>
              </div>

              <span
                style={{
                  padding:
                    '6px 10px',
                  borderRadius:
                    '999px',
                  background:
                    'rgba(34,197,94,0.12)',
                  color: '#86efac',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                ACTIVE
              </span>
            </div>

            {/* Auto lock */}

            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
                gap: '20px',
              }}
            >
              <div>
                <h3
                  style={{
                    margin:
                      '0 0 5px',
                    fontSize: '14px',
                  }}
                >
                  Auto-lock
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: '#6b7280',
                    fontSize: '12px',
                  }}
                >
                  Automatically
                  lock the vault
                  after inactivity.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAutoLock(
                    (value) =>
                      !value
                  )
                }
                style={{
                  width: '48px',
                  height: '26px',
                  padding: '3px',
                  border: 0,
                  borderRadius:
                    '999px',
                  background:
                    autoLock
                      ? '#6366f1'
                      : '#374151',
                  cursor: 'pointer',
                  textAlign:
                    autoLock
                      ? 'right'
                      : 'left',
                }}
                aria-label="Toggle auto lock"
              >
                <span
                  style={{
                    display:
                      'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius:
                      '50%',
                    background:
                      '#ffffff',
                  }}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}

        <section
          className="vault-card"
          style={{
            padding: '22px',
            marginBottom: '18px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 18px',
              fontSize: '17px',
            }}
          >
            Notifications
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'space-between',
              gap: '20px',
            }}
          >
            <div>
              <h3
                style={{
                  margin:
                    '0 0 5px',
                  fontSize: '14px',
                }}
              >
                Sharing notifications
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#6b7280',
                  fontSize: '12px',
                }}
              >
                Notify me when a
                note is shared or
                access changes.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShareNotifications(
                  (value) =>
                    !value
                )
              }
              style={{
                width: '48px',
                height: '26px',
                padding: '3px',
                border: 0,
                borderRadius:
                  '999px',
                background:
                  shareNotifications
                    ? '#6366f1'
                    : '#374151',
                cursor: 'pointer',
                textAlign:
                  shareNotifications
                    ? 'right'
                    : 'left',
              }}
              aria-label="Toggle notifications"
            >
              <span
                style={{
                  display:
                    'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius:
                    '50%',
                  background:
                    '#ffffff',
                }}
              />
            </button>
          </div>
        </section>

        {/* Save */}

        <button
          type="button"
          className="vault-button"
          onClick={saveSettings}
        >
          Save Settings
        </button>

        {/* Security notice */}

        <div
          className="vault-card"
          style={{
            marginTop: '28px',
            padding: '20px',
            display: 'flex',
            gap: '13px',
          }}
        >
          <span
            style={{
              fontSize: '21px',
            }}
          >
            🛡️
          </span>

          <div>
            <h2
              style={{
                margin:
                  '0 0 6px',
                fontSize: '15px',
              }}
            >
              Security reminder
            </h2>

            <p
              style={{
                margin: 0,
                color: '#6b7280',
                fontSize: '12px',
                lineHeight: 1.6,
              }}
            >
              Your master encryption
              key should never be
              sent to the server.
              The production crypto
              layer will enforce this
              architecture.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}