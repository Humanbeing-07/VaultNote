import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import {
  createNote,
  deleteNote,
  getNotes,
  type NoteResponse,
} from '../services/noteService'

import {
  deriveKey,
  encryptText,
  decryptText,
} from '../utils/crypto'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [encryptionPassword, setEncryptionPassword] = useState('')

  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [decryptedNotes, setDecryptedNotes] = useState<
    Record<
      string,
      {
        title: string
        content: string
      }
    >
  >({})

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    try {
      setLoading(true)
      setError('')

      const data = await getNotes()
      setNotes(data)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load notes.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateNote() {
    if (!title.trim()) {
      setError('Please enter a note title.')
      return
    }

    if (!content.trim()) {
      setError('Please enter note content.')
      return
    }

    if (!encryptionPassword) {
      setError('Enter your encryption password.')
      return
    }

    if (!user?.encryptionSalt) {
      setError('Encryption salt is missing.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const saltBytes =
        base64ToUint8Array(user.encryptionSalt)

      const key = await deriveKey(
        encryptionPassword,
        saltBytes
      )

      const encryptedTitle =
        await encryptText(title, key)

      const encryptedContent =
        await encryptText(content, key)

      const newNote = await createNote({
        encryptedTitle,
        encryptedContent,
      })

      setNotes((current) => [
        newNote,
        ...current,
      ])

      setTitle('')
      setContent('')
      setEncryptionPassword('')
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create note.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDecryptNote(
    note: NoteResponse
  ) {
    if (!encryptionPassword) {
      setError('Enter your encryption password.')
      return
    }

    if (!user?.encryptionSalt) {
      setError('Encryption salt is missing.')
      return
    }

    try {
      setError('')

      const saltBytes =
        base64ToUint8Array(user.encryptionSalt)

      const key = await deriveKey(
        encryptionPassword,
        saltBytes
      )

      const decryptedTitle =
        await decryptText(
          note.encryptedTitle,
          key
        )

      const decryptedContent =
        await decryptText(
          note.encryptedContent,
          key
        )

      setDecryptedNotes((current) => ({
        ...current,
        [note.id]: {
          title: decryptedTitle,
          content: decryptedContent,
        },
      }))
    } catch (err) {
      console.error(err)

      setError(
        'Unable to decrypt note. Check your encryption password.'
      )
    }
  }

  async function handleDeleteNote(
    noteId: string
  ) {
    try {
      setError('')

      await deleteNote(noteId)

      setNotes((current) =>
        current.filter(
          (note) => note.id !== noteId
        )
      )

      setDecryptedNotes((current) => {
        const next = { ...current }

        delete next[noteId]

        return next
      })
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete note.'
      )
    }
  }

  async function handleLogout() {
    try {
      await logout()

      navigate('/login', {
        replace: true,
      })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  /*
   * IMPORTANT:
   * Search happens only after local decryption.
   * Server never receives searchQuery.
   */
  const filteredNotes = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase()

    if (!query) {
      return notes
    }

    return notes.filter((note) => {
      const decrypted =
        decryptedNotes[note.id]

      if (!decrypted) {
        return false
      }

      return (
        decrypted.title
          .toLowerCase()
          .includes(query) ||
        decrypted.content
          .toLowerCase()
          .includes(query)
      )
    })
  }, [
    notes,
    decryptedNotes,
    searchQuery,
  ])

  return (
    <main
      className="vault-page"
      style={{
        minHeight: '100vh',
      }}
    >
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
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          VaultNote
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span
            style={{
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            {user?.email}
          </span>

          <Link
            to="/settings"
            style={{
              color: '#9ca3af',
              textDecoration: 'none',
            }}
          >
            Settings
          </Link>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border:
                '1px solid #374151',
              background: 'transparent',
              color: '#e5e7eb',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <section
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            marginBottom: '28px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '30px',
            }}
          >
            Your Vault
          </h1>

          <p
            style={{
              color: '#6b7280',
              marginTop: '8px',
            }}
          >
            Your notes are encrypted
            before they reach the server.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 14px',
              borderRadius: '8px',
              background:
                'rgba(127, 29, 29, 0.25)',
              border:
                '1px solid #7f1d1d',
              color: '#fca5a5',
            }}
          >
            {error}
          </div>
        )}

        <div
          className="vault-card"
          style={{
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: '20px',
            }}
          >
            Create encrypted note
          </h2>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Note title"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '12px',
              padding: '12px',
              borderRadius: '8px',
              border:
                '1px solid #374151',
              background: '#111827',
              color: '#fff',
            }}
          />

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Write your secret note..."
            rows={7}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '12px',
              padding: '12px',
              borderRadius: '8px',
              border:
                '1px solid #374151',
              background: '#111827',
              color: '#fff',
              resize: 'vertical',
            }}
          />

          <input
            type="password"
            value={encryptionPassword}
            onChange={(event) =>
              setEncryptionPassword(
                event.target.value
              )
            }
            placeholder="Encryption password"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '14px',
              padding: '12px',
              borderRadius: '8px',
              border:
                '1px solid #374151',
              background: '#111827',
              color: '#fff',
            }}
          />

          <button
            onClick={handleCreateNote}
            disabled={saving}
            style={{
              padding: '11px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#7c3aed',
              color: '#fff',
              cursor: saving
                ? 'not-allowed'
                : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? 'Encrypting...'
              : 'Encrypt & Save'}
          </button>
        </div>

        {/* SEARCH */}

        <div
          className="vault-card"
          style={{
            padding: '20px',
            marginBottom: '28px',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: '20px',
            }}
          >
            Search encrypted notes
          </h2>

          <p
            style={{
              color: '#6b7280',
              fontSize: '13px',
              lineHeight: 1.5,
            }}
          >
            Search runs locally on your
            device. The server never
            receives your search text.
          </p>

          <input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="Search decrypted notes..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px',
              borderRadius: '8px',
              border:
                '1px solid #374151',
              background: '#111827',
              color: '#fff',
            }}
          />
        </div>

        <div>
          <h2
            style={{
              fontSize: '20px',
              marginBottom: '16px',
            }}
          >
            Your Notes
          </h2>

          {loading ? (
            <p
              style={{
                color: '#9ca3af',
              }}
            >
              Loading encrypted notes...
            </p>
          ) : filteredNotes.length === 0 ? (
            <div
              className="vault-card"
              style={{
                padding: '24px',
                color: '#9ca3af',
              }}
            >
              {searchQuery
                ? 'No decrypted notes match your search.'
                : 'No notes yet.'}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '16px',
              }}
            >
              {filteredNotes.map((note) => {
                const decrypted =
                  decryptedNotes[note.id]

                return (
                  <article
                    key={note.id}
                    className="vault-card"
                    style={{
                      padding: '20px',
                    }}
                  >
                    {decrypted ? (
                      <>
                        <h3
                          style={{
                            marginTop: 0,
                          }}
                        >
                          {decrypted.title}
                        </h3>

                        <p
                          style={{
                            whiteSpace:
                              'pre-wrap',
                            color: '#d1d5db',
                          }}
                        >
                          {decrypted.content}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3
                          style={{
                            marginTop: 0,
                            color: '#9ca3af',
                          }}
                        >
                          Encrypted Note
                        </h3>

                        <p
                          style={{
                            color: '#6b7280',
                          }}
                        >
                          Decrypt this note
                          to view and search
                          its plaintext.
                        </p>
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '16px',
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDecryptNote(
                            note
                          )
                        }
                        style={{
                          padding:
                            '8px 12px',
                          borderRadius:
                            '7px',
                          border:
                            '1px solid #374151',
                          background:
                            'transparent',
                          color: '#e5e7eb',
                          cursor:
                            'pointer',
                        }}
                      >
                        Decrypt
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteNote(
                            note.id
                          )
                        }
                        style={{
                          padding:
                            '8px 12px',
                          borderRadius:
                            '7px',
                          border:
                            '1px solid #7f1d1d',
                          background:
                            'transparent',
                          color: '#fca5a5',
                          cursor:
                            'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <div
          className="vault-card"
          style={{
            marginTop: '32px',
            padding: '20px',
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            Privacy
          </h3>

          <p
            style={{
              marginBottom: 0,
              color: '#6b7280',
              lineHeight: 1.6,
            }}
          >
            VaultNote encrypts note title
            and content in the browser
            using AES-GCM. The backend
            receives only encrypted data.
            Search is performed locally
            after decryption.
          </p>
        </div>
      </section>
    </main>
  )
}

function base64ToUint8Array(
  base64: string
): Uint8Array {
  const binary = atob(base64)

  const bytes =
    new Uint8Array(binary.length)

  for (
    let index = 0;
    index < binary.length;
    index++
  ) {
    bytes[index] =
      binary.charCodeAt(index)
  }

  return bytes
}