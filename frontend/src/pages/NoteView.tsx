import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

type Note = {
  id: string
  title: string
  content: string
  updatedAt: string
}

export default function NoteView() {
  const navigate = useNavigate()
  const location = useLocation()

  const state =
    location.state as
      | {
          note?: Note
        }
      | null

  const note = state?.note

  if (!note) {
    return (
      <main className="vault-page">
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
            to="/notes"
            className="vault-button-secondary"
          >
            Back to Notes
          </Link>
        </header>

        <section
          className="vault-container"
          style={{
            paddingTop: '60px',
          }}
        >
          <div
            className="vault-card"
            style={{
              padding: '50px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                marginBottom: '14px',
              }}
            >
              🔎
            </div>

            <h1
              style={{
                margin:
                  '0 0 10px',
                fontSize: '22px',
              }}
            >
              Note not available
            </h1>

            <p
              style={{
                margin:
                  '0 0 22px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              This note was not
              provided to the viewer.
            </p>

            <button
              type="button"
              className="vault-button"
              onClick={() =>
                navigate('/notes')
              }
            >
              Back to Notes
            </button>
          </div>
        </section>
      </main>
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

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Link
            to="/notes"
            className="vault-button-secondary"
          >
            ← Notes
          </Link>
        </div>
      </header>

      {/* Content */}

      <section
        className="vault-container"
        style={{
          maxWidth: '900px',
          paddingTop: '40px',
          paddingBottom: '60px',
        }}
      >
        {/* Security badge */}

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '6px 10px',
            marginBottom: '18px',

            borderRadius: '999px',

            border:
              '1px solid rgba(34, 197, 94, 0.25)',

            background:
              'rgba(20, 83, 45, 0.14)',

            color: '#86efac',

            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          🔒 PRIVATE NOTE
        </div>

        {/* Title */}

        <h1
          style={{
            margin:
              '0 0 12px',
            fontSize: '34px',
            lineHeight: 1.2,
          }}
        >
          {note.title}
        </h1>

        {/* Metadata */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
            color: '#586174',
            fontSize: '12px',
          }}
        >
          <span>
            Last updated
          </span>

          <span>•</span>

          <span>
            {note.updatedAt}
          </span>
        </div>

        {/* Note */}

        <article
          className="vault-card"
          style={{
            padding: '30px',
            minHeight: '300px',
          }}
        >
          <div
            style={{
              color: '#d1d5db',
              fontSize: '15px',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}
          >
            {note.content ||
              'This note has no content.'}
          </div>
        </article>

        {/* Actions */}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          <button
            type="button"
            className="vault-button-secondary"
            onClick={() =>
              navigate('/notes')
            }
          >
            ← Back
          </button>

          <button
            type="button"
            className="vault-button"
            onClick={() =>
              alert(
                'Secure sharing will be connected in the next module.'
              )
            }
          >
            🔗 Share Note
          </button>
        </div>

        {/* Encryption information */}

        <div
          className="vault-card"
          style={{
            marginTop: '28px',
            padding: '20px',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              fontSize: '22px',
            }}
          >
            🛡️
          </div>

          <div>
            <h2
              style={{
                margin:
                  '0 0 7px',
                fontSize: '15px',
              }}
            >
              Encryption status
            </h2>

            <p
              style={{
                margin: 0,
                color: '#6b7280',
                fontSize: '12px',
                lineHeight: 1.6,
              }}
            >
              The current screen is
              displaying the frontend
              prototype note object.
              Actual end-to-end
              encryption will be added
              when the crypto service
              is connected.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}