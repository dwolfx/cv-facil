import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Editor from './pages/Editor'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Upgrade from './pages/Upgrade'
import { Loader2 } from 'lucide-react'

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-[var(--primary)]">
        <Loader2 size={48} className="animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster richColors position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/editor" element={
            <PrivateRoute>
              <Editor />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          <Route path="/upgrade" element={
            <PrivateRoute>
              <Upgrade />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
