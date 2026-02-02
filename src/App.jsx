import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Editor from './pages/Editor'

// Placeholder for Dashboard
const Dashboard = () => <div className="container" style={{ paddingTop: '2rem' }}><h1>Dashboard Interna</h1><p>Bem-vindo à área logada.</p></div>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  )
}

export default App
