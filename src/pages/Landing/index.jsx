import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Globe, Download, Zap } from 'lucide-react'
import './Landing.css'

const Landing = () => {
    return (
        <div className="landing-page">
            <div className="container">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="logo">
                        <FileText size={28} style={{ color: 'var(--primary)' }} />
                        CV<span>Fácil</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/editor" className="btn btn-secondary">Entrar</Link>
                        <Link to="/editor" className="btn btn-primary" style={{ background: 'var(--gradient-main)', border: 'none' }}>
                            Criar Grátis
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>
                            O Seu Currículo, <br />
                            <span>Profissional e Impecável.</span>
                        </h1>
                        <p>
                            Crie currículos que os recrutadores e robôs (ATS) amam.
                            Design premium, tradução automática e exportação perfeita em minutos.
                        </p>
                        <div className="hero-actions">
                            <Link to="/editor" className="btn btn-primary" style={{ background: 'var(--gradient-main)', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Começar Agora
                            </Link>
                            <a href="#how-it-works" className="btn btn-secondary">
                                Como Funciona
                            </a>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="blob blob-1"></div>
                        <div className="blob blob-2"></div>
                        <div className="hero-card">
                            <div className="mockup-cv">
                                {/* Visual Mockup representation */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#eee' }}></div>
                                    <div>
                                        <div style={{ height: 16, width: 150, background: '#333', marginBottom: 8, borderRadius: 4 }}></div>
                                        <div style={{ height: 12, width: 100, background: 'var(--primary)', opacity: 0.6, borderRadius: 4 }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '30%' }}>
                                        <div style={{ height: 10, width: '100%', background: '#eee', marginBottom: 6, borderRadius: 2 }}></div>
                                        <div style={{ height: 10, width: '80%', background: '#eee', marginBottom: 6, borderRadius: 2 }}></div>
                                        <div style={{ height: 10, width: '90%', background: '#eee', marginBottom: 20, borderRadius: 2 }}></div>
                                    </div>
                                    <div style={{ width: '70%' }}>
                                        <div style={{ height: 14, width: '40%', background: '#ddd', marginBottom: 10, borderRadius: 4 }}></div>
                                        <div style={{ height: 10, width: '100%', background: '#eee', marginBottom: 6, borderRadius: 2 }}></div>
                                        <div style={{ height: 10, width: '100%', background: '#eee', marginBottom: 6, borderRadius: 2 }}></div>
                                        <div style={{ height: 10, width: '80%', background: '#eee', marginBottom: 6, borderRadius: 2 }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features" id="how-it-works">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2>Recursos Poderosos</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
                            Tudo o que você precisa para se destacar no mercado de trabalho.
                        </p>
                    </div>

                    <div className="features-grid">
                        <FeatureCard
                            icon={<Zap size={24} />}
                            title="Rápido e Fácil"
                            description="Preencha seus dados uma vez e gere múltiplos modelos de currículo instantaneamente."
                        />
                        <FeatureCard
                            icon={<Globe size={24} />}
                            title="Tradução Automática"
                            description="Traduza seu currículo para Inglês ou Espanhol com apenas um clique. Expanda suas fronteiras."
                        />
                        <FeatureCard
                            icon={<Download size={24} />}
                            title="PDF Otimizado"
                            description="Exportação limpa e estruturada para passar nos filtros de robôs (ATS) do LinkedIn e Gupy."
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}

const FeatureCard = ({ icon, title, description }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 0 }}>{description}</p>
    </div>
)

export default Landing
