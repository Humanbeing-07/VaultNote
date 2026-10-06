import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const {
    user,
    loading,
  } = useAuth()

  const location =
    useLocation()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080b12',
          color: '#9ca3af',
          fontSize: '14px',
        }}
      >
        Loading VaultNote...
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  return <Outlet />
}