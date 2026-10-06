import { useState } from 'react'
import { Link } from 'react-router-dom'

type SharedNote = {
  id: string
  title: string
  sharedBy: string
  permission: 'VIEW' | 'EDIT'
  expiresAt: string
}

const initialSharedNotes: SharedNote[] = []

export default function SharedNotes() {
  const [notes, setNotes] =
    useState<SharedNote[]>(
      initialSharedNotes
    )

  const [showShareForm, setShowShareForm] =
    useState(false)

  const [noteTitle, setNoteTitle] =
    useState('')

  const [recipient, setRecipient] =
    useState('')

  const [permission, setPermission] =
    useState<'VIEW' | 'EDIT'>('VIEW')

  const [message, setMessage] =
    useState<string | null>(null)

  function createShare() {
    setMessage(null)

    if (!noteTitle.trim()) {
      setMessage(
        'Enter a note title.'
      )
      return
    }

    if (!recipient.trim()) {
      setMessage(
        'Enter the recipient email.'
      )
      return
    }

    const sharedNote: SharedNote = {
      id: Date.now().toString(),
      title: noteTitle.trim(),
      sharedBy: recipient.trim(),
      permission,
      expiresAt: 'Not set',
    }

    setNotes((current) => [
      sharedNote,
      ...current,
    ])

    setNoteTitle('')
    setRecipient('')
    setPermission('VIEW')
    setShowShareForm(false)

    setMessage(
      'Share created in the frontend prototype.'
    )
  }

  function revokeShare(id: string) {
    setNotes((current) =>
      current.filter(
        (note) =>
          note.id !== id
      )
    )

    setMessage(
      'Share revoked.'
    )
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
          paddingTop: '34px',
          paddingBottom: '50px',
        }}
      >
        {/* Heading */}

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div>
            <p
              style={{
                margin:
                  '0 0 7px',
                color: '#818cf8',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              SECURE SHARING
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: '28px',
              }}
            >
              Shared Notes
            </h1>

            <p
              style={{
                margin:
                  '8px 0 0',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Manage notes shared with
              other users.
            </p>
          </div>

          <button
            type="button"
            className="vault-button"
            onClick={() =>
              setShowShareForm(
                (value) => !value
              )
            }
          >
            {showShareForm
              ? 'Close'
              : '+ Share Note'}
          </button>
        </div>

        {/* Message */}

        {message && (
          <div
            className="vault-success"
            style={{
              marginBottom: '18px',
            }}
          >
            {message}
          </div>
        )}

        {/* Share form */}

        {showShareForm && (
          <div
            className="vault-card"
            style={{
              padding: '22px',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                margin:
                  '0 0 18px',
                fontSize: '18px',
              }}
            >
              Share a note
            </h2>

            <div
              style={{
                marginBottom: '15px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#d1d5db',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Note
              </label>

              <input
                className="vault-input"
                value={noteTitle}
                onChange={(event) =>
                  setNoteTitle(
                    event.target.value
                  )
                }
                placeholder="Note title"
              />
            </div>

            <div
              style={{
                marginBottom: '15px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#d1d5db',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Recipient
              </label>

              <input
                className="vault-input"
                type="email"
                value={recipient}
                onChange={(event) =>
                  setRecipient(
                    event.target.value
                  )
                }
                placeholder="recipient@example.com"
              />
            </div>

            <div
              style={{
                marginBottom: '18px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#d1d5db',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Permission
              </label>

              <select
                className="vault-input"
                value={permission}
                onChange={(event) =>
                  setPermission(
                    event.target
                      .value as
                      | 'VIEW'
                      | 'EDIT'
                  )
                }
              >
                <option value="VIEW">
                  View only
                </option>

                <option value="EDIT">
                  Can edit
                </option>
              </select>
            </div>

            <button
              type="button"
              className="vault-button"
              onClick={
                createShare
              }
            >
              Create Share
            </button>
          </div>
        )}

        {/* Empty state */}

        {notes.length === 0 ? (
          <div
            className="vault-card"
            style={{
              padding: '50px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '40px',
                marginBottom: '14px',
              }}
            >
              🔗
            </div>

            <h2
              style={{
                margin:
                  '0 0 8px',
                fontSize: '18px',
              }}
            >
              No shared notes
            </h2>

            <p
              style={{
                margin:
                  '0 0 20px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Notes shared with
              teammates will appear here.
            </p>

            <button
              type="button"
              className="vault-button"
              onClick={() =>
                setShowShareForm(
                  true
                )
              }
            >
              Share a Note
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '16px',
            }}
          >
            {notes.map(
              (note) => (
                <article
                  key={note.id}
                  className="vault-card"
                  style={{
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color:
                            '#818cf8',
                          fontSize:
                            '11px',
                          fontWeight:
                            600,
                          marginBottom:
                            '7px',
                        }}
                      >
                        SHARED NOTE
                      </div>

                      <h2
                        style={{
                          margin: 0,
                          fontSize:
                            '17px',
                        }}
                      >
                        {note.title}
                      </h2>
                    </div>

                    <span
                      style={{
                        height:
                          'fit-content',
                        padding:
                          '5px 8px',
                        borderRadius:
                          '999px',
                        background:
                          'rgba(99,102,241,0.12)',
                        color:
                          '#a5b4fc',
                        fontSize:
                          '10px',
                        fontWeight:
                          600,
                      }}
                    >
                      {note.permission}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop:
                        '18px',
                      paddingTop:
                        '14px',
                      borderTop:
                        '1px solid #252d3d',
                    }}
                  >
                    <p
                      style={{
                        margin:
                          '0 0 7px',
                        color:
                          '#9ca3af',
                        fontSize:
                          '12px',
                      }}
                    >
                      Shared with
                    </p>

                    <p
                      style={{
                        margin: 0,
                        color:
                          '#d1d5db',
                        fontSize:
                          '13px',
                      }}
                    >
                      {note.sharedBy}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop:
                        '16px',
                      color:
                        '#586174',
                      fontSize:
                        '11px',
                    }}
                  >
                    Expires:{' '}
                    {note.expiresAt}
                  </div>

                  <button
                    type="button"
                    className="vault-button-danger"
                    style={{
                      width: '100%',
                      marginTop:
                        '18px',
                    }}
                    onClick={() =>
                      revokeShare(
                        note.id
                      )
                    }
                  >
                    Revoke Access
                  </button>
                </article>
              )
            )}
          </div>
        )}

        {/* Security explanation */}

        <div
          className="vault-card"
          style={{
            marginTop: '28px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '13px',
            }}
          >
            <span
              style={{
                fontSize: '22px',
              }}
            >
              🔐
            </span>

            <div>
              <h2
                style={{
                  margin:
                    '0 0 7px',
                  fontSize: '15px',
                }}
              >
                Revocable sharing
              </h2>

              <p
                style={{
                  margin: 0,
                  color: '#6b7280',
                  fontSize: '12px',
                  lineHeight: 1.6,
                }}
              >
                VaultNote will use
                encrypted note keys and
                revocable access grants
                so access can be removed
                without exposing the
                plaintext note to the
                server.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}