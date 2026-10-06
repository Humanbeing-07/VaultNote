import {
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

type Note = {
  id: string
  title: string
  content: string
  updatedAt: string
}

const initialNotes: Note[] = []

export default function Notes() {
  const navigate = useNavigate()

  const [notes, setNotes] =
    useState<Note[]>(initialNotes)

  const [search, setSearch] =
    useState('')

  const [showEditor, setShowEditor] =
    useState(false)

  const [title, setTitle] =
    useState('')

  const [content, setContent] =
    useState('')

  const filteredNotes =
    useMemo(() => {
      const query =
        search.trim().toLowerCase()

      if (!query) {
        return notes
      }

      return notes.filter(
        (note) =>
          note.title
            .toLowerCase()
            .includes(query) ||
          note.content
            .toLowerCase()
            .includes(query)
      )
    }, [notes, search])

  function createNote() {
    const trimmedTitle =
      title.trim()

    const trimmedContent =
      content.trim()

    if (!trimmedTitle) {
      return
    }

    const newNote: Note = {
      id:
        Date.now().toString(),

      title: trimmedTitle,

      content:
        trimmedContent,

      updatedAt:
        new Date().toLocaleString(),
    }

    setNotes((current) => [
      newNote,
      ...current,
    ])

    setTitle('')
    setContent('')
    setShowEditor(false)
  }

  function deleteNote(
    id: string
  ) {
    setNotes((current) =>
      current.filter(
        (note) =>
          note.id !== id
      )
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
          justifyContent:
            'space-between',

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
        {/* Page heading */}

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
              PRIVATE NOTES
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: '28px',
              }}
            >
              My Notes
            </h1>

            <p
              style={{
                margin:
                  '8px 0 0',

                color: '#6b7280',

                fontSize: '13px',
              }}
            >
              Create and manage
              your private notes.
            </p>
          </div>

          <button
            type="button"
            className="vault-button"
            onClick={() =>
              setShowEditor(
                (value) => !value
              )
            }
          >
            {showEditor
              ? 'Close'
              : '+ New Note'}
          </button>
        </div>

        {/* Editor */}

        {showEditor && (
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
              Create new note
            </h2>

            <div
              style={{
                marginBottom: '14px',
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
                Title
              </label>

              <input
                className="vault-input"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Note title"
              />
            </div>

            <div
              style={{
                marginBottom: '16px',
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
                Content
              </label>

              <textarea
                className="vault-textarea"
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder="Write your private note..."
                rows={7}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
              }}
            >
              <button
                type="button"
                className="vault-button"
                onClick={
                  createNote
                }
              >
                Save Note
              </button>

              <button
                type="button"
                className="vault-button-secondary"
                onClick={() => {
                  setTitle('')
                  setContent('')
                  setShowEditor(
                    false
                  )
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}

        <div
          style={{
            marginBottom: '22px',
          }}
        >
          <input
            className="vault-input"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="🔎  Search your notes..."
          />
        </div>

        {/* Notes */}

        {filteredNotes.length ===
        0 ? (
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
              📝
            </div>

            <h2
              style={{
                margin:
                  '0 0 8px',
                fontSize: '18px',
              }}
            >
              {search
                ? 'No notes found'
                : 'Your vault is empty'}
            </h2>

            <p
              style={{
                margin:
                  '0 0 20px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              {search
                ? 'Try a different search term.'
                : 'Create your first private note to get started.'}
            </p>

            {!search && (
              <button
                type="button"
                className="vault-button"
                onClick={() =>
                  setShowEditor(
                    true
                  )
                }
              >
                Create First Note
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredNotes.map(
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

                      alignItems:
                        'flex-start',

                      gap: '12px',
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '17px',
                        lineHeight: 1.3,
                      }}
                    >
                      {note.title}
                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        deleteNote(
                          note.id
                        )
                      }
                      style={{
                        border: 0,
                        background:
                          'transparent',
                        color: '#f87171',
                        fontSize: '14px',
                      }}
                      title="Delete note"
                    >
                      ✕
                    </button>
                  </div>

                  <p
                    style={{
                      margin:
                        '12px 0 16px',

                      color: '#9ca3af',

                      fontSize: '13px',

                      lineHeight: 1.6,

                      whiteSpace:
                        'pre-wrap',

                      display:
                        '-webkit-box',

                      WebkitLineClamp: 5,

                      WebkitBoxOrient:
                        'vertical',

                      overflow: 'hidden',
                    }}
                  >
                    {note.content ||
                      'No content'}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',

                      alignItems:
                        'center',

                      paddingTop: '12px',

                      borderTop:
                        '1px solid #252d3d',
                    }}
                  >
                    <span
                      style={{
                        color:
                          '#586174',

                        fontSize:
                          '11px',
                      }}
                    >
                      Updated{' '}
                      {note.updatedAt}
                    </span>

                    <button
                      type="button"
                      className="vault-button-secondary"
                      onClick={() =>
                        navigate(
                          `/notes/${note.id}`,
                          {
                            state: {
                              note,
                            },
                          }
                        )
                      }
                    >
                      Open
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}

        {/* Security notice */}

        <div
          className="vault-card"
          style={{
            marginTop: '28px',
            padding: '16px',
            display: 'flex',
            gap: '12px',
          }}
        >
          <span>🔒</span>

          <p
            style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '12px',
              lineHeight: 1.5,
            }}
          >
            This UI is currently
            using local state for
            note management. The
            encrypted backend storage
            layer will be connected
            next.
          </p>
        </div>
      </section>
    </main>
  )
}