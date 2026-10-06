type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = 'medium',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizes = {
    small: '18px',
    medium: '28px',
    large: '42px',
  }

  const spinnerSize = sizes[size]

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '20px',
      }}
    >
      <div
        aria-label="Loading"
        role="status"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid #30384a',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation:
            'vaultnote-spin 0.8s linear infinite',
        }}
      />

      {text && (
        <span
          style={{
            color: '#9ca3af',
            fontSize: '13px',
          }}
        >
          {text}
        </span>
      )}

      <style>
        {`
          @keyframes vaultnote-spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  )

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080b12',
        }}
      >
        {content}
      </div>
    )
  }

  return content
}