
import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Globe, Download, Zap, Check, CheckCircle, Star, Shield, Briefcase, ShieldCheck, Mail, MessageCircle } from 'lucide-react'
import './Landing.css'
import { toast } from 'sonner'

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
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/login?mode=login" className="btn btn-secondary">Entrar</Link>
                        <Link to="/login?mode=register" className="btn btn-primary" style={{ background: 'var(--gradient-main)', border: 'none' }}>
                            Começar Grátis
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
                        <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
                            <Link to="/login?mode=register" className="btn btn-primary" style={{ background: 'var(--gradient-main)', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Começar Grátis
                            </Link>
                            <a href="#features" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Conhecer Recursos</a>
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
                            styleClass="style-1"
                        />
                        <FeatureCard
                            icon={<Download size={24} />}
                            title="PDF Otimizado"
                            description="Exportação perfeita para passar nos filtros de robôs (ATS) e garantir sua leitura."
                            styleClass="style-1"
                        />
                        <FeatureCard
                            icon={<Globe size={24} />}
                            title="Tradução Automática"
                            description="Crie versões em Inglês ou Espanhol do seu currículo com apenas um clique."
                            styleClass="style-1"
                        />
                        <FeatureCard
                            icon={<Shield size={24} />}
                            title="Visibilidade Profissional"
                            description="Seu currículo pode ser encontrado por recrutadores parceiros* para acelerar sua contratação."
                            disclaimer="Você escolhe se quer compartilhar."
                            styleClass="style-1"
                        />
                        <FeatureCard
                            icon={<FileText size={24} />}
                            title="Modelos Profissionais"
                            description="Templates recomendados e aprovados por recrutadores."
                            badge="Em Breve"
                            styleClass="style-1"
                        />
                        <FeatureCard
                            icon={<Star size={24} />}
                            title="Ajuste com IA"
                            description="Nossa inteligência artificial analisa e sugere melhorias no seus textos."
                            badge="Em Breve"
                            styleClass="style-1"
                        />
                    </div>
                </section>

                {/* Talent Pool / Visibility Section */}
                <section className="visibility-section" id="visibility" style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: '#fafafb' }}>
                    <div className="container visibility-grid">
                        <div className="visibility-content">
                            <h2>Seu Currículo em Destaque no Mercado</h2>
                            <p className="intro">
                                Uma grande parte das vagas nem chega a ser aberta ao público, pois muitos recrutadores encontram candidatos em bancos de currículos.<br />
                                Ao criar seu currículo no CV Fácil, você poderá ser visto por recrutadores e ser encontrado pelo seu próximo emprego de forma simples e passiva.
                            </p>
                            
                            <div className="visibility-features">
                                <div className="visibility-feature-item">
                                    <div className="visibility-feature-icon">
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="visibility-feature-text">
                                        <h4>Conexão Direta com Empresas</h4>
                                        <p>Seu currículo fica visível para headhunters e gestores de tecnologia de vários segmentos que buscam perfis qualificados.</p>
                                    </div>
                                </div>

                                <div className="visibility-feature-item">
                                    <div className="visibility-feature-icon">
                                        <Mail size={20} />
                                    </div>
                                    <div className="visibility-feature-text">
                                        <h4>Propostas no seu E-mail ou WhatsApp</h4>
                                        <p>Sem processos seletivos burocráticos. As empresas entram em contato direto com você para agendar entrevistas de forma simplificada.</p>
                                    </div>
                                </div>

                                <div className="visibility-feature-item">
                                    <div className="visibility-feature-icon">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="visibility-feature-text">
                                        <h4>Privacidade e Controle Sob sua Escolha</h4>
                                        <p>Essa opção vem ativada por padrão para acelerar suas contratações, mas você decide. A qualquer momento, desative ou ative o compartilhamento de qualquer currículo no seu painel com um único clique.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="recruiter-mockup-wrapper">
                            <div className="recruiter-mockup">
                                <div className="recruiter-mockup-header">
                                    <div className="recruiter-avatar" style={{ background: '#22c55e' }}>JM</div>
                                    <div className="recruiter-info">
                                        <h5>Juliana Martins</h5>
                                        <span>Tech Recruiter na InovaTech</span>
                                    </div>
                                    <div className="notification-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                        Via WhatsApp
                                    </div>
                                </div>
                                <div className="recruiter-mockup-body">
                                    <div className="mockup-message whatsapp">
                                        "Olá! Vi seu currículo no CV Fácil e gostei muito do seu perfil para a nossa vaga. Você teria disponibilidade para bater um papo esta semana?"
                                    </div>
                                    <button className="mockup-action-btn whatsapp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => toast.success('Simulação: Abrindo conversa no WhatsApp com a recrutadora!')}>
                                        <MessageCircle size={16} />
                                        Responder Recrutador
                                    </button>
                                </div>
                            </div>
                        </div>
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

                    <div className="pricing-grid">

                        {/* Free */}
                        <div className="pricing-card free">
                            <span className="pricing-badge free">Grátis</span>
                            <div className="pricing-price-container">
                                <span className="pricing-price" style={{ color: 'var(--text-main)' }}>R$ 0</span>
                                <span className="pricing-period">/ sempre</span>
                            </div>
                            <p className="pricing-desc">Você começa aqui.</p>

                            <ul className="pricing-list">
                                <li className="pricing-list-item">
                                    <Check size={20} color="var(--primary)" /> 2 Currículos
                                </li>
                                <li className="pricing-list-item">
                                    <Check size={20} color="var(--primary)" /> Exportação em PDF
                                </li>
                                <li className="pricing-list-item">
                                    <Check size={20} color="var(--primary)" /> Sem Marca D'água
                                </li>
                            </ul>

                            <Link to="/login?mode=register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                Começar Grátis
                            </Link>
                        </div>

                        {/* Pro (Orange Gradient) */}
                        <div className="pricing-card pro">
                            <div style={{ position: 'absolute', top: -12, right: 20, background: 'white', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '1rem', textTransform: 'uppercase', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                MAIS POPULAR
                            </div>

                            <span className="pricing-badge pro">PRO</span>

                            <div className="pricing-price-container">
                                <span className="pricing-price" style={{ color: 'white' }}>R$ {priceInfo.value}</span>
                                <span className="pricing-period" style={{ color: '#ffedd5' }}>{priceInfo.label}</span>
                            </div>
                            <p className="pricing-desc">{priceInfo.desc}</p>

                            <ul className="pricing-list">
                                <li className="pricing-list-item">
                                    <Check size={20} color="white" strokeWidth={3} /> <b>Currículos Ilimitados</b>
                                </li>
                                <li className="pricing-list-item">
                                    <Check size={20} color="white" strokeWidth={3} /> Acesso a novos modelos
                                </li>
                                <li className="pricing-list-item">
                                    <Check size={20} color="white" strokeWidth={3} /> Sem Marca D'água
                                </li>
                                <li className="pricing-list-item">
                                    <Check size={20} color="white" strokeWidth={3} /> Tradução Automática
                                </li>
                            </ul>

                            {/* Internal Toggle */}
                            <div className="pricing-toggle-container">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className="pricing-toggle-btn"
                                    style={{ background: billingCycle === 'monthly' ? 'white' : 'transparent', color: billingCycle === 'monthly' ? 'var(--primary)' : '#ffedd5' }}
                                >
                                    Mensal
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    className="pricing-toggle-btn"
                                    style={{ background: billingCycle === 'yearly' ? 'white' : 'transparent', color: billingCycle === 'yearly' ? 'var(--primary)' : '#ffedd5', position: 'relative' }}
                                >
                                    Anual
                                    <span style={{ position: 'absolute', top: -10, right: -5, fontSize: '0.6rem', background: '#22c55e', color: 'white', padding: '1px 5px', borderRadius: '10px', fontWeight: 'bold' }}>-17%</span>
                                </button>
                                <button
                                    onClick={() => setBillingCycle('lifetime')}
                                    className="pricing-toggle-btn"
                                    style={{ background: billingCycle === 'lifetime' ? 'white' : 'transparent', color: billingCycle === 'lifetime' ? '#7c3aed' : '#ffedd5' }}
                                >
                                    Vitalício
                                </button>
                            </div>

                            <Link to="/login?mode=register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'white', color: 'var(--primary)', border: 'none', padding: '1rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                Assinar Agora
                            </Link>
                        </div>

                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2rem' }}>
                        Pagamento seguro processado por Stripe. Cancele quando quiser.
                    </p>
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
                            <li style={{ marginBottom: '0.8rem' }}><Link to="/login?mode=register" style={{ color: 'inherit', textDecoration: 'none' }}>Criar Conta</Link></li>
                            <li style={{ marginBottom: '0.8rem' }}><Link to="/login?mode=login" style={{ color: 'inherit', textDecoration: 'none' }}>Entrar</Link></li>
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

const FeatureCard = ({ icon, title, description, badge, styleClass, disclaimer }) => {
    const isAvailable = badge === 'Disponível';
    const badgeStyle = isAvailable
        ? { background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }
        : { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };

    if (styleClass === 'style-3') {
        return (
            <div className="feature-card style-3" style={{ position: 'relative' }}>
                {badge && (
                    <div style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        zIndex: 10,
                        ...badgeStyle
                    }}>
                        {badge}
                    </div>
                )}
                <div className="feature-card-style-3-header">
                    <div className="feature-icon" style={{ marginBottom: 0, width: 40, height: 40 }}>{icon}</div>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                </div>
                <div className="feature-card-style-3-body">
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 0 }}>{description}</p>
                    {disclaimer && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.7, marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem', marginBottom: 0 }}>
                            * {disclaimer}
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={`feature-card ${styleClass || ''}`} style={{ position: 'relative', overflow: 'hidden', paddingBottom: disclaimer ? '8px' : undefined }}>
            {badge && (
                <div style={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    ...badgeStyle
                }}>
                    {badge}
                </div>
            )}
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 0 }}>{description}</p>
            {disclaimer && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.7, marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem', marginBottom: 0 }}>
                    * {disclaimer}
                </p>
            )}
        </div>
    )
}

export default Landing
