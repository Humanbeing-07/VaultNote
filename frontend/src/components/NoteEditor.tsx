import {
  useEffect,
  useState,
} from 'react'

type NoteEditorProps = {
  initialTitle?: string
  initialContent?: string
  loading?: boolean
  saving?: boolean
  onSave: (
    title: string,
    content: string
  ) => Promise<void> | void
  onCancel?: () => void
}

export default function NoteEditor({
  initialTitle = '',
  initialContent = '',
  loading = false,
  saving = false,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] =
    useState(initialTitle)

  const [content, setContent] =
    useState(initialContent)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const trimmedTitle =
      title.trim()

    const trimmedContent =
      content.trim()

    if (!trimmedTitle) {
      setError(
        'Note title is required.'
      )
      return
    }

    if (trimmedTitle.length > 200) {
      setError(
        'Note title cannot exceed 200 characters.'
      )
      return
    }

    if (!trimmedContent) {
      setError(
        'Note content is required.'
      )
      return
    }

    try {
      setError(null)

      await onSave(
        trimmedTitle,
        content
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save note.'
      )
    }
  }

  if (loading) {
    return (
      <div
        className="vault-card"
        style={{
          padding: '32px',
          textAlign: 'center',
          color: '#9ca3af',
        }}
      >
        Loading secure note...
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="vault-card"
      style={{
        padding: '24px',
      }}
    >
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <label
          htmlFor="note-title"
          style={{
            display: 'block',
            marginBottom: '8px',
            color: '#d1d5db',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Note title
        </label>

        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Enter note title..."
          maxLength={200}
          disabled={saving}
          className="vault-input"
        />

        <div
          style={{
            marginTop: '6px',
            textAlign: 'right',
            color: '#6b7280',
            fontSize: '11px',
          }}
        >
          {title.length}/200
        </div>
      </div>

      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <label
          htmlFor="note-content"
          style={{
            display: 'block',
            marginBottom: '8px',
            color: '#d1d5db',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Note
        </label>

        <textarea
          id="note-content"
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="Write your private note..."
          disabled={saving}
          className="vault-textarea"
          style={{
            minHeight: '360px',
            lineHeight: 1.7,
          }}
        />
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
          display: 'flex',
          justifyContent:
            'flex-end',
          gap: '10px',
        }}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="vault-button-secondary"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={saving}
          className="vault-button"
        >
          {saving
            ? 'Encrypting...'
            : 'Save Securely'}
        </button>
      </div>

      <div
        style={{
          marginTop: '16px',
          paddingTop: '14px',
          borderTop:
            '1px solid #252d3d',
          color: '#6b7280',
          fontSize: '12px',
          textAlign: 'center',
        }}
      >
        🔐 Your note will be encrypted
        before it is sent to the server.
      </div>
    </form>
  )
}