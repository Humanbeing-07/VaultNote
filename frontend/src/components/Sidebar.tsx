import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const linkStyle = ({
    isActive,
  }: {
    isActive: boolean
  }) => ({
    display: 'block',
    padding: '11px 14px',
    borderRadius: '9px',
    marginBottom: '6px',
    color: isActive
      ? '#ffffff'
      : '#9ca3af',
    background: isActive
      ? 'rgba(99, 102, 241, 0.18)'
      : 'transparent',
    fontWeight: isActive
      ? 600
      : 400,
    transition: 'all 0.15s ease',
  })

  return (
    <aside
      style={{
        width: '230px',
        minWidth: '230px',
        minHeight: 'calc(100vh - 63px)',
        padding: '22px 16px',
        borderRight:
          '1px solid #252d3d',
        background: '#0b0f18',
      }}
    >
      <div
        style={{
          marginBottom: '24px',
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: '8px',
            color: '#6b7280',
            fontSize: '12px',
            fontWeight: 700,
            textTransform:
              'uppercase',
            letterSpacing:
              '0.08em',
          }}
        >
          Vault
        </p>

        <h3
          style={{
            margin: 0,
            fontSize: '16px',
            color: '#f3f4f6',
          }}
        >
          My Notes
        </h3>
      </div>

      <nav>
        <NavLink
          to="/notes"
          style={linkStyle}
        >
          📝 All Notes
        </NavLink>

        <NavLink
          to="/notes?filter=favorites"
          style={linkStyle}
        >
          ⭐ Favorites
        </NavLink>

        <NavLink
          to="/shared"
          style={linkStyle}
        >
          🔗 Shared With Me
        </NavLink>

        <NavLink
          to="/notes?filter=encrypted"
          style={linkStyle}
        >
          🔐 Encrypted
        </NavLink>
      </nav>

      <div
        style={{
          marginTop: '32px',
          paddingTop: '18px',
          borderTop:
            '1px solid #252d3d',
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: '10px',
            color: '#6b7280',
            fontSize: '12px',
          }}
        >
          Security
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#86efac',
            fontSize: '13px',
          }}
        >
          <span>●</span>
          <span>
            End-to-end encrypted
          </span>
        </div>
      </div>
    </aside>
  )
}