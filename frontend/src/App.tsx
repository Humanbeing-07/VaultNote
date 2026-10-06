import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import NoteView from './pages/NoteView'
import SharedNotes from './pages/SharedNotes'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected routes */}

          <Route
            element={
              <ProtectedRoute />
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/notes"
              element={<Notes />}
            />

            <Route
              path="/notes/:id"
              element={<NoteView />}
            />

            <Route
              path="/shared"
              element={<SharedNotes />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Route>

          {/* Default route */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* Unknown route */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}