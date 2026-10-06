type RevokeModalProps = {
  isOpen: boolean
  recipientEmail?: string
  loading?: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
}

export default function RevokeModal({
  isOpen,
  recipientEmail,
  loading = false,
  onClose,
  onConfirm,
}: RevokeModalProps) {
  if (!isOpen) {
    return null
  }

  async function handleConfirm() {
    try {
      await onConfirm()
    } catch (error) {
      console.error(
        'Failed to revoke share:',
        error
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
        aria-labelledby="revoke-title"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              display: 'grid',
              placeItems: 'center',
              marginBottom: '14px',
              borderRadius: '12px',
              background:
                'rgba(220, 38, 38, 0.12)',
              fontSize: '22px',
            }}
          >
            🔒
          </div>

          <h2
            id="revoke-title"
            style={{
              margin: 0,
              marginBottom: '8px',
              color: '#f9fafb',
              fontSize: '20px',
            }}
          >
            Revoke Access?
          </h2>

          <p
            style={{
              margin: 0,
              color: '#9ca3af',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to
            revoke this user's access
            to the note?
          </p>
        </div>

        {recipientEmail && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 14px',
              borderRadius: '9px',
              background: '#0f1522',
              border:
                '1px solid #30384a',
              color: '#d1d5db',
              fontSize: '13px',
            }}
          >
            <span
              style={{
                color: '#6b7280',
              }}
            >
              Recipient:{' '}
            </span>

            {recipientEmail}
          </div>
        )}

        <div
          style={{
            marginBottom: '20px',
            padding: '12px 14px',
            borderRadius: '9px',
            background:
              'rgba(220, 38, 38, 0.08)',
            border:
              '1px solid rgba(220, 38, 38, 0.2)',
            color: '#fca5a5',
            fontSize: '12px',
            lineHeight: 1.5,
          }}
        >
          ⚠️ After revocation, the
          recipient will no longer be
          authorized to access the
          shared note.
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
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="vault-button-danger"
          >
            {loading
              ? 'Revoking...'
              : 'Revoke Access'}
          </button>
        </div>
      </div>
    </div>
  )
}