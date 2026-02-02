import React, { useState } from 'react'
import { Download, Save, Globe, ChevronLeft, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import ClassicSidebar from '../../components/CVTemplates/ClassicSidebar'
import ImportModal from '../../components/ImportModal'
import './Editor.css'

// Initial State
const initialResumeState = {
    personalInfo: {
        fullName: '',
        role: '',
        email: '',
        phone: '',
        linkedin: '',
        location: '',
        website: '',
        summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: []
}

const Editor = () => {
    const [resumeData, setResumeData] = useState(initialResumeState)
    const [activeTab, setActiveTab] = useState('personal')
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)

    const handleInputChange = (section, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleImport = (file) => {
        // 1. Close Modal
        setIsImportModalOpen(false)

        // 2. Simulate "Reading" processing
        const processingTime = 2000 // 2 seconds delay

        // Show a temporary loading state (using a simple alert for now, or we could add a Loading Overlay)
        // For better UX, let's just do the logic and show the result.

        setTimeout(() => {
            // 3. Mock Data Extraction (Simulating what the AI would read from the PDF)
            const mockExtractedData = {
                personalInfo: {
                    fullName: 'Victor Hugo Nogueira de Morais',
                    role: 'Product Designer Especialista',
                    email: 'victor.hugo@email.com',
                    phone: '(11) 98765-4321',
                    linkedin: 'linkedin.com/in/victorhugo',
                    location: 'São Paulo, Brasil',
                    website: 'victorhugo.design',
                    summary: 'Product Designer (UX/UI) com sólido background como desenvolvedor Front-End e paixão por solucionar quebra-cabeças complexos. Especialista em equilibrar requisitos de conformidade e segurança com experiências de usuário fluidas.'
                },
                experience: [
                    {
                        period: 'Ago 2024 - Jan 2026',
                        location: 'São Paulo, Brasil',
                        position: 'Product Designer Especialista',
                        company: 'Entain',
                        description: 'Liderança na migração e validação legal das plataformas para o mercado brasileiro. Otimização de experiência na área de Cassino.'
                    },
                    {
                        period: 'Mar 2023 - Jul 2024',
                        location: 'São Paulo, Brasil',
                        position: 'Product Design Specialist',
                        company: 'Vivo Telefônica Brasil',
                        description: 'Liderança no design da área de fintech, incluindo criação da conta digital e integração com PIX.'
                    }
                ],
                education: [
                    {
                        period: '2019 - 2021',
                        degree: 'Product Designer Specialist',
                        school: 'Awari'
                    },
                    {
                        period: '2010 - 2013',
                        degree: 'Gestão de Tecnologia da Informação',
                        school: 'Centro Educacional SENAC'
                    }
                ],
                skills: ['UX/UI Design', 'Design System', 'Prototipagem', 'Autodidata', 'Curioso'],
                languages: [
                    { name: 'Inglês', level: 'Avançado' },
                    { name: 'Espanhol', level: 'Intermediário' }
                ]
            }

            // 4. Update State
            setResumeData(mockExtractedData)
            alert('SUCESSO! ✨\n\nO arquivo foi processado. Seus dados foram preenchidos automaticamente.\n(Isso é uma simulação baseada no seu template)')

        }, processingTime)
    }

    return (
        <div className="editor-layout">
            {/* Import Modal */}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />

            {/* Top Bar */}
            <header className="editor-header glass">
                <div className="header-left">
                    <Link to="/" className="btn-icon"><ChevronLeft size={20} /></Link>
                    <input
                        type="text"
                        placeholder="Nome do Currículo"
                        className="cv-title-input"
                        defaultValue="Meu Currículo Profissional"
                    />
                </div>
                <div className="header-right">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setIsImportModalOpen(true)}
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                        <UploadCloud size={18} /> <span className="desktop-only">Importar CV</span>
                    </button>
                    <button className="btn btn-secondary btn-sm" title="Traduzir">
                        <Globe size={18} /> <span className="desktop-only">Traduzir</span>
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Download size={18} /> <span className="desktop-only">Baixar PDF</span>
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="editor-container">
                {/* Left: Form Area */}
                <div className="editor-form-area custom-scrollbar">
                    <div className="form-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            Dados Pessoais
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                            onClick={() => setActiveTab('experience')}
                        >
                            Experiência
                        </button>
                    </div>

                    <div className="form-content">
                        {activeTab === 'personal' && (
                            <PersonalInfoForm
                                data={resumeData.personalInfo}
                                onChange={(field, value) => handleInputChange('personalInfo', field, value)}
                            />
                        )}
                        {activeTab === 'experience' && (
                            <div className="empty-state">
                                <h3>Seção de Experiência</h3>
                                <p>Adicione suas experiências profissionais aqui. (Em desenvolvimento)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Preview Area */}
                <div className="editor-preview-area custom-scrollbar">
                    <div className="preview-paper">
                        <ClassicSidebar data={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const PersonalInfoForm = ({ data, onChange }) => (
    <div className="form-section animate-fade-in">
        <h2>Dados Pessoais</h2>
        <p className="form-helper">Essas informações ficarão no topo do seu currículo.</p>

        <div className="form-group">
            <label>Nome Completo</label>
            <input
                type="text"
                className="input-field"
                value={data.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                placeholder="Ex: João da Silva"
            />
        </div>

        <div className="form-group">
            <label>Cargo / Título Profissional</label>
            <input
                type="text"
                className="input-field"
                value={data.role}
                onChange={(e) => onChange('role', e.target.value)}
                placeholder="Ex: Product Designer Especialista"
            />
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>E-mail</label>
                <input
                    type="email"
                    className="input-field"
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    placeholder="joao@exemplo.com"
                />
            </div>
            <div className="form-group">
                <label>Telefone</label>
                <input
                    type="text"
                    className="input-field"
                    value={data.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Cidade/Estado</label>
                <input
                    type="text"
                    className="input-field"
                    value={data.location}
                    onChange={(e) => onChange('location', e.target.value)}
                    placeholder="São Paulo, SP"
                />
            </div>
            <div className="form-group">
                <label>LinkedIn (URL)</label>
                <input
                    type="text"
                    className="input-field"
                    value={data.linkedin}
                    onChange={(e) => onChange('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/joaosilva"
                />
            </div>
        </div>

        <div className="form-group">
            <label>Site / Portfólio (URL)</label>
            <input
                type="text"
                className="input-field"
                value={data.website}
                onChange={(e) => onChange('website', e.target.value)}
                placeholder="seusite.com"
            />
        </div>

        <div className="form-group">
            <label>Objetivo / Resumo Profissional</label>
            <textarea
                className="textarea-field"
                rows="6"
                value={data.summary}
                onChange={(e) => onChange('summary', e.target.value)}
                placeholder="Breve resumo sobre sua carreira e objetivos..."
            ></textarea>
        </div>
    </div>
)

export default Editor
