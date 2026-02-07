import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import Editor from './pages/Editor'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Upgrade from './pages/Upgrade'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
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
    return <Navigate to="/" />
  }

  return children || <Outlet />
}

// Public Route Component (Redirects to Dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-[var(--primary)]">
        <Loader2 size={48} className="animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" />
  }

  return children || <Outlet />
}

// Layout wrapper to provide AuthContext and Toaster to all routes
const RootLayout = () => {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Outlet />
    </AuthProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <PublicRoute><Landing /></PublicRoute> },
      { path: '/login', element: <PublicRoute><Login /></PublicRoute> },
      { path: '/register', element: <PublicRoute><Register /></PublicRoute> },
      { path: '/forgot-password', element: <PublicRoute><ForgotPassword /></PublicRoute> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/terms', element: <Terms /> },
      { path: '/contact', element: <Contact /> },
      {
        path: '/dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      },
      {
        path: '/editor',
        element: <PrivateRoute><Editor /></PrivateRoute>
      },
      {
        path: '/settings',
        element: <PrivateRoute><Settings /></PrivateRoute>
      },
      {
        path: '/upgrade',
        element: <PrivateRoute><Upgrade /></PrivateRoute>
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
