import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Editor from './pages/Editor'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Upgrade from './pages/Upgrade'

function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/upgrade" element={<Upgrade />} />
      </Routes>
    </Router>
  )
}

export default App
