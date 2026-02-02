import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/editor')
    }

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column' }}>
            <h1>Login</h1>
            <p style={{ marginBottom: '2rem' }}>Em breve: Login social com Google, LinkedIn e GitHub.</p>
            <button onClick={handleLogin} className="btn btn-primary" style={{ background: 'var(--gradient-main)', minWidth: '200px' }}>
                Entrar (Simulação)
            </button>
            <a href="/" style={{ marginTop: '1rem', color: 'var(--primary)' }}>Voltar para Home</a>
        </div>
    )
}

export default Login
