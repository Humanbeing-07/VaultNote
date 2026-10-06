import { Link } from 'react-router-dom'

import type { Note } from '../types/note'

type NoteCardProps = {
  note: Note
  onDelete?: (noteId: string) => void
  onFavorite?: (noteId: string) => void
}

export default function NoteCard({
  note,
  onDelete,
  onFavorite,
}: NoteCardProps) {
  function handleDelete(
    event: React.MouseEvent
  ) {
    event.preventDefault()
    event.stopPropagation()

    onDelete?.(note.id)
  }

  function handleFavorite(
    event: React.MouseEvent
  ) {
    event.preventDefault()
    event.stopPropagation()

    onFavorite?.(note.id)
  }

  const updatedDate = new Date(
    note.updatedAt
  )

  const formattedDate =
    Number.isNaN(
      updatedDate.getTime()
    )
      ? 'Recently'
      : updatedDate.toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }
        )

  return (
    <article
      className="vault-card"
      style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '190px',
        transition:
          'transform 0.15s ease, border-color 0.15s ease',
      }}
    >
      <Link
        to={`/notes/${note.id}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: '#f9fafb',
              fontSize: '17px',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow:
                'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {note.title ||
              'Untitled Note'}
          </h3>

          {note.isFavorite && (
            <span
              title="Favorite"
              aria-label="Favorite"
            >
              ⭐
            </span>
          )}
        </div>

        <p
          style={{
            margin: 0,
            color: '#9ca3af',
            fontSize: '14px',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient:
              'vertical',
            overflow: 'hidden',
          }}
        >
          {note.preview ||
            'No preview available.'}
        </p>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {note.isEncrypted && (
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '999px',
                background:
                  'rgba(99, 102, 241, 0.14)',
                color: '#a5b4fc',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              🔐 Encrypted
            </span>
          )}

          {note.isShared && (
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '999px',
                background:
                  'rgba(34, 197, 94, 0.12)',
                color: '#86efac',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              🔗 Shared
            </span>
          )}

          <span
            style={{
              marginLeft: 'auto',
              color: '#6b7280',
              fontSize: '11px',
            }}
          >
            {formattedDate}
          </span>
        </div>
      </Link>

      <div
        style={{
          marginTop: '14px',
          paddingTop: '12px',
          borderTop:
            '1px solid #252d3d',
          display: 'flex',
          justifyContent:
            'flex-end',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={handleFavorite}
          className="vault-button-secondary"
          style={{
            padding: '7px 10px',
            fontSize: '12px',
          }}
          aria-label={
            note.isFavorite
              ? 'Remove from favorites'
              : 'Add to favorites'
          }
        >
          {note.isFavorite
            ? '★'
            : '☆'}
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="vault-button-danger"
            style={{
              padding: '7px 10px',
              fontSize: '12px',
            }}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  )
}