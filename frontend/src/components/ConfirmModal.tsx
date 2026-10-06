import type { ReactNode } from 'react'

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  danger?: boolean
  icon?: ReactNode
  onClose: () => void
  onConfirm: () => Promise<void> | void
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  danger = false,
  icon = '⚠️',
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  async function handleConfirm() {
    try {
      await onConfirm()
    } catch (error) {
      console.error(
        'Confirmation action failed:',
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
        zIndex: 1100,
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
        aria-labelledby="confirm-modal-title"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            display: 'grid',
            placeItems: 'center',
            marginBottom: '16px',
            borderRadius: '12px',
            background: danger
              ? 'rgba(220, 38, 38, 0.12)'
              : 'rgba(99, 102, 241, 0.12)',
            fontSize: '21px',
          }}
        >
          {icon}
        </div>

        <h2
          id="confirm-modal-title"
          style={{
            margin: 0,
            marginBottom: '8px',
            color: '#f9fafb',
            fontSize: '20px',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            marginBottom: '22px',
            color: '#9ca3af',
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

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
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={
              danger
                ? 'vault-button-danger'
                : 'vault-button'
            }
          >
            {loading
              ? 'Please wait...'
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}