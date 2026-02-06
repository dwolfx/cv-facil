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

                {/* Pricing Section (New) */}
                <section className="pricing" id="pricing" style={{ paddingBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2>Planos Flexíveis</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
                            Comece grátis e evolua conforme sua carreira decola.
                        </p>
                    </div>

                    <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))', justifyContent: 'center' }}>

                        {/* Free */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ background: '#eee', color: '#555', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Grátis</span>
                            </div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>R$ 0</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Para quem está começando.</p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', flex: 1 }}>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> 2 Currículos
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Exportação em PDF
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Otimizado para ATS
                                </li>
                            </ul>

                            <Link to="/editor" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                Começar Grátis
                            </Link>
                        </div>

                        {/* Pro (Yearly) */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', border: '2px solid var(--primary)', position: 'relative', background: 'white' }}>
                            <div style={{ position: 'absolute', top: -12, right: 20, background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                                MAIS POPULAR
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Anual</span>
                            </div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>R$ 50 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ano</span></h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Equivale a R$ 4,16/mês.</p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', flex: 1 }}>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> <b>Currículos Ilimitados</b>
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Acesso a novos modelos
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Suporte Prioritário
                                </li>
                            </ul>

                            <Link to="/editor" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--gradient-main)', border: 'none' }}>
                                Assinar Agora
                            </Link>
                        </div>

                        {/* Lifetime */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ background: '#eee', color: '#555', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Vitalício</span>
                            </div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>R$ 150 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/único</span></h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pague uma vez, use para sempre.</p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', flex: 1 }}>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Tudo do plano Pro
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Sem mensalidades
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Acesso Vitalício
                                </li>
                            </ul>

                            <Link to="/editor" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                Comprar Acesso
                            </Link>
                        </div>

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
