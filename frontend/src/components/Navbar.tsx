import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error(
        'Logout failed:',
        error
      )
    }
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        borderBottom:
          '1px solid #252d3d',
        background:
          'rgba(8, 11, 18, 0.92)',
        backdropFilter:
          'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          gap: '20px',
        }}
      >
        <Link
          to="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '20px',
          }}
        >
          <span
            style={{
              width: '34px',
              height: '34px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '9px',
              background: '#6366f1',
              color: '#fff',
              fontSize: '17px',
            }}
          >
            V
          </span>

          <span>VaultNote</span>
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/notes">
            Notes
          </Link>

          <Link to="/shared">
            Shared
          </Link>

          <Link to="/settings">
            Settings
          </Link>
        </nav>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            {user?.name ||
              user?.email ||
              'User'}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="vault-button-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}