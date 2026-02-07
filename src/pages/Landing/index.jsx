
import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Globe, Download, Zap, Check, CheckCircle, Star } from 'lucide-react'
import './Landing.css'

const Landing = () => {
    const [billingCycle, setBillingCycle] = React.useState('monthly')

    const getPrice = () => {
        switch (billingCycle) {
            case 'monthly': return { value: '10', label: '/mês', desc: 'Flexibilidade total' }
            case 'yearly': return { value: '100', label: '/ano', desc: 'Economize 17%' }
            case 'lifetime': return { value: '300', label: '/único', desc: 'Pague uma única vez' }
            default: return { value: '10', label: '/mês', desc: 'Flexibilidade total' }
        }
    }

    const priceInfo = getPrice()

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
                        <Link to="/login" className="btn btn-secondary">Entrar</Link>
                        <Link to="/register" className="btn btn-primary" style={{ background: 'var(--gradient-main)', border: 'none' }}>
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
                            <Link to="/register" className="btn btn-primary" style={{ background: 'var(--gradient-main)', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Começar Agora
                            </Link>
                            <a href="#how-it-works" className="btn btn-secondary">
                                Como Funciona
                            </a>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--primary)" /> Sem cartão de crédito</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--primary)" /> Download PDF imediato</span>
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
                            Ferramentas modernas para alavancar sua carreira.
                        </p>
                    </div>

                    <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <FeatureCard
                            icon={<Zap size={24} />}
                            title="Editor Intuitivo"
                            description="Interface limpa e fácil de usar. Foque no conteúdo do seu currículo sem complicações."
                        />
                        <FeatureCard
                            icon={<FileText size={24} />}
                            title="Modelos Profissionais"
                            description="Templates testados e aprovados por recrutadores para diferentes momentos de carreira."
                        />
                        <FeatureCard
                            icon={<Download size={24} />}
                            title="PDF Otimizado"
                            description="Exportação perfeita para passar nos filtros de robôs (ATS) e garantir sua leitura."
                        />
                        <FeatureCard
                            icon={<Globe size={24} />}
                            title="Tradução Automática"
                            description="Crie versões em Inglês ou Espanhol do seu currículo com apenas um clique."
                            badge="Em Breve"
                        />
                        <FeatureCard
                            icon={<Star size={24} />}
                            title="Ajuste com IA"
                            description="Nossa inteligência artificial analisa e sugere melhorias no seus textos."
                            badge="Em Breve"
                        />
                        <FeatureCard
                            icon={<Check size={24} />}
                            title="Privacidade Total"
                            description="Seus dados são seus. Não compartilhamos suas informações com terceiros."
                        />
                    </div>
                </section>

                {/* Pricing Section (2 Columns Pro Gradient) */}
                <section className="pricing" id="pricing" style={{ paddingBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2>Planos Flexíveis</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
                            Comece grátis e evolua conforme sua carreira decola.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 450px))', justifyContent: 'center', gap: '2rem' }}>

                        {/* Free */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', border: '1px solid #e2e8f0', background: 'white' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ background: '#eee', color: '#555', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Grátis</span>
                            </div>
                            <h3 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 800 }}>R$ 0</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Você começa aqui.</p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', flex: 1 }}>
                                <li style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}>
                                    <Check size={20} color="var(--primary)" /> 2 Currículos
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}>
                                    <Check size={20} color="var(--primary)" /> Exportação em PDF
                                </li>
                            </ul>

                            <Link to="/register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                                Começar Grátis
                            </Link>
                        </div>

                        {/* Pro (Orange Gradient) */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', background: 'linear-gradient(to bottom, var(--primary), #ea580c)', color: 'white', border: 'none', position: 'relative', transform: 'scale(1.02)', boxShadow: '0 20px 25px -5px rgba(249, 115, 22, 0.4)' }}>
                            <div style={{ position: 'absolute', top: -12, right: 20, background: 'white', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '1rem', textTransform: 'uppercase' }}>
                                MAIS POPULAR
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>PRO</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>R$ {priceInfo.value}</h3>
                                <span style={{ fontSize: '1.1rem', color: '#ffedd5' }}>{priceInfo.label}</span>
                            </div>
                            <p style={{ color: '#fff7ed', fontWeight: 'bold', fontSize: '0.9rem' }}>{priceInfo.desc}</p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', flex: 1 }}>
                                <li style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}>
                                    <Check size={20} color="white" strokeWidth={3} /> <b>Currículos Ilimitados</b>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}>
                                    <Check size={20} color="white" strokeWidth={3} /> Acesso a novos modelos
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}>
                                    <Check size={20} color="white" strokeWidth={3} /> Sem Marca D'água
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>
                                    <Check size={20} color="#ffedd5" /> Tradução Automática (Em Breve)
                                </li>
                            </ul>

                            {/* Internal Toggle */}
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', marginBottom: '1.5rem', backdropFilter: 'blur(4px)' }}>
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    style={{ flex: 1, padding: '8px 4px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', background: billingCycle === 'monthly' ? 'white' : 'transparent', color: billingCycle === 'monthly' ? 'var(--primary)' : '#ffedd5', transition: 'all 0.2s' }}
                                >
                                    Mensal
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    style={{ flex: 1, padding: '8px 4px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', background: billingCycle === 'yearly' ? 'white' : 'transparent', color: billingCycle === 'yearly' ? 'var(--primary)' : '#ffedd5', transition: 'all 0.2s', position: 'relative' }}
                                >
                                    Anual
                                    {billingCycle !== 'yearly' && <span style={{ position: 'absolute', top: -10, right: -5, fontSize: '0.6rem', background: '#22c55e', color: 'white', padding: '1px 5px', borderRadius: '10px', fontWeight: 'bold' }}>-17%</span>}
                                </button>
                                <button
                                    onClick={() => setBillingCycle('lifetime')}
                                    style={{ flex: 1, padding: '8px 4px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', background: billingCycle === 'lifetime' ? 'white' : 'transparent', color: billingCycle === 'lifetime' ? '#7c3aed' : '#ffedd5', transition: 'all 0.2s' }}
                                >
                                    Vitalício
                                </button>
                            </div>

                            <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'white', color: 'var(--primary)', border: 'none', padding: '1rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                Assinar Agora
                            </Link>
                        </div>

                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="testimonials" style={{ paddingBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2>Quem usa, aprova</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
                            Junte-se a milhares de profissionais que conseguiram o emprego dos sonhos.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: '#475569' }}>
                                "Consegui 3 entrevistas na primeira semana. O modelo Clean é sensacional!"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>RS</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Ricardo Silva</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Desenvolvedor Frontend</div>
                                </div>
                            </div>
                        </div>

                        <div className="feature-card" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: '#475569' }}>
                                "Eu não sabia como montar meu currículo. O CVFácil fez tudo por mim."
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>AP</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Ana Paula</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Marketing Digital</div>
                                </div>
                            </div>
                        </div>

                        <div className="feature-card" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: '#475569' }}>
                                "Simples, rápido e o resultado é muito profissional. Recomendo!"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>CE</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Carlos Eduardo</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Engenheiro Civil</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer style={{ background: '#1e293b', color: 'white', padding: '4rem 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                    <div>
                        <div className="logo" style={{ color: 'white', marginBottom: '1rem' }}>
                            <FileText size={28} style={{ color: 'var(--primary)' }} />
                            CV<span>Fácil</span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Potencializando carreiras com tecnologia de ponta.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Produto</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', spaceY: '0.8rem' }}>
                            <li style={{ marginBottom: '0.8rem' }}><a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Planos</a></li>
                            <li style={{ marginBottom: '0.8rem' }}><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Recursos</a></li>
                            <li style={{ marginBottom: '0.8rem' }}><Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>Criar Conta</Link></li>
                            <li style={{ marginBottom: '0.8rem' }}><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Entrar</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8' }}>
                            <li style={{ marginBottom: '0.8rem' }}><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Termos de Uso</Link></li>
                            <li style={{ marginBottom: '0.8rem' }}><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidade</Link></li>
                            <li style={{ marginBottom: '0.8rem' }}><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contato</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container" style={{ borderTop: '1px solid #334155', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    &copy; 2026 CVFácil. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    )
}

const FeatureCard = ({ icon, title, description, badge }) => (
    <div className="feature-card" style={{ position: 'relative' }}>
        {badge && <div style={{ position: 'absolute', top: 15, right: 15, background: '#e2e8f0', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{badge}</div>}
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 0 }}>{description}</p>
    </div>
)

export default Landing
