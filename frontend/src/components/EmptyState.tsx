import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  message: string
  icon?: ReactNode
  actionText?: string
  onAction?: () => void
}

export default function EmptyState({
  title,
  message,
  icon = '📝',
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="vault-card"
      style={{
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          display: 'grid',
          placeItems: 'center',
          marginBottom: '18px',
          borderRadius: '18px',
          background:
            'rgba(99, 102, 241, 0.12)',
          fontSize: '28px',
        }}
      >
        {icon}
      </div>

      <h2
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
          maxWidth: '420px',
          margin: 0,
          color: '#9ca3af',
          fontSize: '14px',
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="vault-button"
          style={{
            marginTop: '20px',
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  )
}