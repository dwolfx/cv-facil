
import React, { useState, useEffect } from 'react'
import {
    Download, UploadCloud, ChevronDown, PlusCircle, Trash2,
    Mail, Phone, MapPin, Briefcase, GraduationCap,
    Wrench, User, Star, Minus, Plus, FileText, Globe,
    Home, Settings, Layout
} from 'lucide-react'
import { Link } from 'react-router-dom'
// import ImportModal from '../../components/ImportModal'
import './Editor.css'

// Initial State matching the Stitch layout fields
const initialResumeState = {
    personalInfo: {
        fullName: 'Victor Hugo Nogueira de Morais',
        role: 'Product Designer Especialista',
        email: 'victor9009@gmail.com',
        phone: '(11) 95156-5851',
        linkedin: 'https://www.linkedin.com/in/victorhugo/',
        portfolio: '',
        instagram: '',
        youtube: '',
        locations: ['São Paulo / Betim - Brasil'],
        nationality: 'Brasileiro',
        summary: 'Product Designer (UX/UI) com sólido background como desenvolvedor Front-End e paixão por solucionar quebra-cabeças complexos.\n\nEspecialista em equilibrar requisitos de conformidade e segurança com experiências de usuário fluidas em setores de alta criticidade como Fintechs, Betting e Saúde.\n\nExperiência liderando projetos de grande impacto e implementando Design Systems escaláveis para empresas como Vivo, Bradesco e Globo.'
    },
    experience: [
        {
            id: 1,
            company: 'Entain (SportingBet, BetBoo e BetMGM)',
            position: 'Product Designer Especialista',
            date: 'Ago 2024 - Presente',
            location: 'Remoto',
            description: '• Conformidade e UX: Liderança da migração e validação legal das plataformas para o mercado brasileiro, garantindo aderência total à legislação local.\n• Retenção e Engajamento: Otimização da experiência na área de Cassino, focando na fidelização do usuário e impulsionando o crescimento trimestral da plataforma.'
        },
        {
            id: 2,
            company: 'Vivo (Telefônica Brasil)',
            position: 'Product Design Specialist',
            date: 'Mar 2023 - Jul 2024',
            location: 'São Paulo, Brasil',
            description: '• Infraestrutura Fintech: Liderança no design da área de fintech, incluindo a criação da conta digital e integração com o sistema PIX segundo as normas do Banco Central.\n• Cartões de Crédito: Definição da estratégia de design para o lançamento da nova área de cartões, criando interfaces intuitivas para o aplicativo e portal do cliente.\n• Branding de Operações: Desenvolvimento de nova identidade visual e linguagem de design para modernizar a imagem da área no mercado.'
        },
        {
            id: 3,
            company: 'Banco Bradesco',
            position: 'Product Designer Especialista',
            date: 'Dez 2022 - Mar 2023',
            location: 'São Paulo, Brasil',
            description: '• Foco B2B e Eficiência: Otimização da experiência do vendedor em lojas de veículos, agilizando o processo de contratação sem abrir mão das normas bancárias.\n• Mentoria Técnica: Mentoria de designers juniores durante o desenvolvimento da plataforma Autoline, preservando a identidade da marca e auxiliando no desenvolvimento da carreira deles.'
        }
    ],
    education: [
        {
            id: 1,
            school: 'Awari',
            degree: 'Product Designer Specialist',
            date: '2019 - 2021',
            location: 'São Paulo, Brasil'
        },
        {
            id: 2,
            school: 'Centro Educacional SENAC',
            degree: 'Gestão de Tecnologia da Informação',
            date: 'Jun 2010 - Dez 2013',
            location: 'São Paulo, Brasil'
        }
    ],
    skills: ['Auto-didata', 'UX/UI Design', 'Testes de usabilidade', 'Design System', 'Mentoria profissional', 'Prototipagem', 'Pesquisa de mercado', 'Curioso'],
    languages: [
        { id: 1, name: 'Inglês', level: 'Avançado' },
        { id: 2, name: 'Espanhol', level: 'Intermediário' }
    ]
}

const Editor = () => {
    const [resumeData, setResumeData] = useState(initialResumeState)
    // const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [activeSection, setActiveSection] = useState('personal')
    const [zoom, setZoom] = useState(100)
    // Socials visibility toggle state
    const [enabledSocials, setEnabledSocials] = useState({
        linkedin: true,
        portfolio: false,
        instagram: false,
        youtube: false
    })

    // Calculate Resume Strength
    const calculateStrength = () => {
        let score = 0;
        if (resumeData.personalInfo.fullName) score += 10;
        if (resumeData.personalInfo.role) score += 10;
        if (resumeData.personalInfo.summary) score += 15;
        if (resumeData.experience.length > 0) score += 25;
        if (resumeData.education.length > 0) score += 15;
        if (resumeData.skills.length > 0) score += 15;
        if (resumeData.personalInfo.email) score += 5;
        if (resumeData.languages.length > 0) score += 5;
        return Math.min(score, 100);
    }
    const strength = calculateStrength();

    const toggleSection = (section) => setActiveSection(activeSection === section ? null : section)

    const handleChange = (section, field, value) => {
        setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
    }

    const handleLocationChange = (index, value) => {
        setResumeData(prev => {
            const newLocs = [...(prev.personalInfo.locations || [])]
            newLocs[index] = value
            return { ...prev, personalInfo: { ...prev.personalInfo, locations: newLocs } }
        })
    }
    const addLocation = () => {
        setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, locations: [...(prev.personalInfo.locations || []), ''] } }))
    }
    const removeLocation = (index) => {
        setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, locations: (prev.personalInfo.locations || []).filter((_, i) => i !== index) } }))
    }

    const handleArrayChange = (section, index, field, value) => {
        setResumeData(prev => {
            const newArray = [...prev[section]]
            newArray[index] = { ...newArray[index], [field]: value }
            return { ...prev, [section]: newArray }
        })
    }
    const addItem = (section, template) => {
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], { ...template, id: Date.now() }] }))
    }
    const removeItem = (section, index) => {
        setResumeData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }))
    }
    const handleSkillChange = (index, value) => {
        setResumeData(prev => {
            const newSkills = [...prev.skills]
            newSkills[index] = value
            return { ...prev, skills: newSkills }
        })
    }

    const toggleSocial = (key) => {
        setEnabledSocials(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-row overflow-hidden">
            {/* <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} /> */}

            {/* Left Navigation Rail (Blue) */}
            <nav className="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-6 z-20">
                <Link to="/" className="p-2 bg-blue-600 rounded-lg text-white mb-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <FileText size={20} />
                </Link>

                <div className="flex flex-col gap-4 w-full">
                    <button className="h-10 w-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors relative group">
                        <Layout size={20} />
                        <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Templates</span>
                    </button>
                    <button className="h-10 w-full flex items-center justify-center text-blue-600 bg-blue-50 border-r-2 border-blue-600">
                        <FileText size={20} />
                    </button>
                    <button className="h-10 w-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                        <UploadCloud size={20} />
                    </button>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                    <button className="h-10 w-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                        <Settings size={20} />
                    </button>
                    {/* User Avatar Placeholder */}
                    <div className="size-8 rounded-full bg-slate-200 overflow-hidden mx-auto">
                        <img src="https://ui-avatars.com/api/?name=Ricardo+Silva&background=random" alt="User" />
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Top Bar - White */}
                <header className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 h-16 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" />
                            <h1 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Novo currículo</h1>
                        </div>
                        <span className="text-[10px] text-slate-400 pl-6">Rascunho criado agora</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase">FORÇA DO CURRÍCULO</span>
                            <span className="text-xs font-bold text-emerald-600">{strength}%</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <button className="flex h-9 items-center justify-center rounded-md px-4 bg-[#0ea5e9] text-white text-xs font-bold transition-all hover:bg-[#0284c7] shadow-sm gap-2">
                            <Download size={14} /> <span>Importar Currículo</span>
                        </button>
                        <button className="flex h-9 items-center justify-center rounded-md px-4 bg-[#0ea5e9] text-white text-xs font-bold transition-all hover:bg-[#0284c7] shadow-sm gap-2">
                            <span>Exportar PDF</span>
                        </button>
                    </div>
                </header>

                <main className="flex flex-1 overflow-hidden relative">
                    {/* Sidebar Form */}
                    <aside className="w-[380px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10 shrink-0">
                        <div className="flex-1 overflow-y-auto no-scrollbar p-0 pb-0">

                            {/* Section Header */}
                            <div className="p-6 pb-4">
                                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Layout size={18} className="text-blue-600" />
                                    Conteúdo do Currículo
                                </h2>

                                <div className="mt-6 mb-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Força do currículo</span>
                                        <span className="text-xs font-bold text-emerald-500">{strength}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${strength}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 leading-tight">Adicione mais informações para completar.</p>
                                </div>

                                <button onClick={() => alert("Coming Soon")} className="w-full h-9 mt-4 flex items-center justify-center gap-2 bg-[#0ea5e9] text-white rounded-[4px] text-xs font-bold hover:bg-[#0284c7] transition-colors shadow-sm">
                                    <UploadCloud size={14} /> Importar Currículo
                                </button>
                            </div>

                            <div className="px-6 pb-20 space-y-3">
                                {/* Personal Info */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('personal')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left bg-blue-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-1.5 rounded-md text-blue-600"><User size={16} /></div>
                                            <span className="font-bold text-sm text-slate-800">Dados Pessoais</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'personal' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeSection === 'personal' && (
                                        <div className="p-4 pt-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="space-y-4">
                                                <div className="form-group">
                                                    <label className="input-label">Nome Completo</label>
                                                    <input className="input-field-modern" value={resumeData.personalInfo.fullName} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">Cargo</label>
                                                    <input className="input-field-modern" value={resumeData.personalInfo.role} onChange={(e) => handleChange('personalInfo', 'role', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">E-mail</label>
                                                    <input className="input-field-modern" value={resumeData.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">Telefone</label>
                                                    <input className="input-field-modern" value={resumeData.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">Nacionalidade</label>
                                                    <input className="input-field-modern" value={resumeData.personalInfo.nationality} onChange={(e) => handleChange('personalInfo', 'nationality', e.target.value)} />
                                                </div>

                                                <div className="form-group">
                                                    <label className="input-label">Localização</label>
                                                    <div className="space-y-2">
                                                        {(resumeData.personalInfo.locations || []).map((loc, i) => (
                                                            <div key={i} className="flex gap-2">
                                                                <input className="input-field-modern" value={loc} onChange={(e) => handleLocationChange(i, e.target.value)} />
                                                                <button onClick={() => removeLocation(i)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                                            </div>
                                                        ))}
                                                        <button onClick={addLocation} className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1 mt-1">
                                                            <PlusCircle size={12} /> Adicionar Local
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Social Toggles */}
                                                <div className="pt-2 space-y-3 border-t border-slate-50 mt-2">
                                                    <div className="flex flex-col gap-3">
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 border-slate-300 size-3.5" checked={enabledSocials.linkedin} onChange={() => toggleSocial('linkedin')} />
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-blue-600">LinkedIn</span>
                                                        </label>
                                                        {enabledSocials.linkedin && (
                                                            <input className="input-field-modern" placeholder="URL do LinkedIn" value={resumeData.personalInfo.linkedin} onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} />
                                                        )}

                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 border-slate-300 size-3.5" checked={enabledSocials.portfolio} onChange={() => toggleSocial('portfolio')} />
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-blue-600">Portfólio</span>
                                                        </label>
                                                        {enabledSocials.portfolio && (
                                                            <input className="input-field-modern" placeholder="URL do Portfólio" value={resumeData.personalInfo.portfolio} onChange={(e) => handleChange('personalInfo', 'portfolio', e.target.value)} />
                                                        )}

                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 border-slate-300 size-3.5" checked={enabledSocials.instagram} onChange={() => toggleSocial('instagram')} />
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-pink-600">Instagram</span>
                                                        </label>
                                                        {enabledSocials.instagram && (
                                                            <input className="input-field-modern" placeholder="@usuario" value={resumeData.personalInfo.instagram} onChange={(e) => handleChange('personalInfo', 'instagram', e.target.value)} />
                                                        )}

                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 border-slate-300 size-3.5" checked={enabledSocials.youtube} onChange={() => toggleSocial('youtube')} />
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-red-600">YouTube</span>
                                                        </label>
                                                        {enabledSocials.youtube && (
                                                            <input className="input-field-modern" placeholder="URL do YouTube" value={resumeData.personalInfo.youtube} onChange={(e) => handleChange('personalInfo', 'youtube', e.target.value)} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sobre Mim */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('summary')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-1.5 rounded-md text-slate-600"><FileText size={16} /></div>
                                            <span className="font-bold text-sm text-slate-700">Sobre mim</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'summary' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeSection === 'summary' && (
                                        <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <textarea className="input-field-modern min-h-[120px]" placeholder="Breve resumo..." value={resumeData.personalInfo.summary} onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)} />
                                        </div>
                                    )}
                                </div>

                                {/* Experiência Profissional */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('experience')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-1.5 rounded-md text-slate-600"><Briefcase size={16} /></div>
                                            <span className="font-bold text-sm text-slate-700">Experiência Profissional</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'experience' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeSection === 'experience' && (
                                        <div className="p-4 pt-4 space-y-4 border-t border-slate-100">
                                            {resumeData.experience.map((exp, i) => (
                                                <div key={exp.id || i} className="p-4 bg-white border border-slate-200 rounded-lg relative group shadow-sm transition-all hover:border-blue-300">
                                                    <button onClick={() => removeItem('experience', i)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="input-label">Cargo</label>
                                                            <input className="input-field-modern font-medium" value={exp.position} onChange={(e) => handleArrayChange('experience', i, 'position', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="input-label">Empresa</label>
                                                            <input className="input-field-modern" value={exp.company} onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)} />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="input-label">Período</label>
                                                                <input className="input-field-modern" value={exp.date} onChange={(e) => handleArrayChange('experience', i, 'date', e.target.value)} />
                                                            </div>
                                                            <div>
                                                                <label className="input-label">Local</label>
                                                                <input className="input-field-modern" value={exp.location} onChange={(e) => handleArrayChange('experience', i, 'location', e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="input-label">Descrição</label>
                                                            <textarea className="input-field-modern min-h-[80px]" rows="3" value={exp.description} onChange={(e) => handleArrayChange('experience', i, 'description', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => addItem('experience', { company: '', position: '', date: '', location: '', description: '' })} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 border border-dashed border-slate-300 transition-all">
                                                <PlusCircle size={14} /> Adicionar Experiência
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Escolaridade */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('education')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-1.5 rounded-md text-slate-600"><GraduationCap size={16} /></div>
                                            <span className="font-bold text-sm text-slate-700">Escolaridade</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'education' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeSection === 'education' && (
                                        <div className="p-4 pt-4 space-y-4 border-t border-slate-100">
                                            {resumeData.education.map((edu, i) => (
                                                <div key={edu.id || i} className="p-4 bg-white border border-slate-200 rounded-lg relative group shadow-sm">
                                                    <button onClick={() => removeItem('education', i)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="input-label">Curso / Grau</label>
                                                            <input className="input-field-modern font-medium" value={edu.degree} onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="input-label">Instituição</label>
                                                            <input className="input-field-modern" value={edu.school} onChange={(e) => handleArrayChange('education', i, 'school', e.target.value)} />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="input-label">Período</label>
                                                                <input className="input-field-modern" value={edu.date} onChange={(e) => handleArrayChange('education', i, 'date', e.target.value)} />
                                                            </div>
                                                            <div>
                                                                <label className="input-label">Local</label>
                                                                <input className="input-field-modern" value={edu.location} onChange={(e) => handleArrayChange('education', i, 'location', e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => addItem('education', { school: '', degree: '', date: '', location: '' })} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 border border-dashed border-slate-300 transition-all">
                                                <PlusCircle size={14} /> Adicionar Educação
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Habilidades */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('skills')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-1.5 rounded-md text-slate-600"><Wrench size={16} /></div>
                                            <span className="font-bold text-sm text-slate-700">Habilidades</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'skills' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeSection === 'skills' && (
                                        <div className="p-4 pt-2 space-y-3 border-t border-slate-100">
                                            <div className="flex flex-wrap gap-2">
                                                {resumeData.skills.map((skill, i) => (
                                                    <div key={i} className="flex items-center bg-white border border-slate-200 rounded-lg pl-3 pr-1 py-1.5 shadow-sm">
                                                        <input className="text-xs font-semibold text-slate-700 w-full bg-transparent outline-none min-w-[50px] max-w-[120px]" value={skill} onChange={(e) => handleSkillChange(i, e.target.value)} />
                                                        <button onClick={() => {
                                                            const newSkills = resumeData.skills.filter((_, idx) => idx !== i)
                                                            setResumeData(prev => ({ ...prev, skills: newSkills }))
                                                        }} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => setResumeData(prev => ({ ...prev, skills: [...prev.skills, 'Nova Habilidade'] }))} className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-2">
                                                + Adicionar Habilidade
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                                    <PlusCircle size={16} /> Adicionar Seção Personalizada
                                </button>
                            </div>
                        </div>

                        {/* Sticky Footer Plan Info */}
                        <div className="mt-auto p-6 pt-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 z-10">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
                                <span className="text-[10px] font-bold text-blue-900 dark:text-blue-100 uppercase block mb-1">Plano Gratuito</span>
                                <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '50%' }}></div>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-medium">1 de 2 currículos criados</p>
                                <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    Fazer upgrade <span className="text-lg leading-none">→</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Preview Area */}
                    <section className="flex-1 bg-[#525659] h-full overflow-hidden relative flex flex-col items-center justify-start pt-10 pb-20">

                        {/* Zoom Controls (Floating) */}
                        <div className="fixed bottom-8 left-1/2 transform translate-x-[100px] z-50 bg-[#1e293b] text-white px-2 py-1.5 rounded-full flex items-center gap-3 shadow-2xl border border-slate-600">
                            <button onClick={() => setZoom(prev => Math.max(50, prev - 10))} className="hover:bg-slate-700 p-1 rounded-full text-slate-300 hover:text-white"><Minus size={14} /></button>
                            <span className="text-xs font-bold min-w-[40px] text-center">{zoom}%</span>
                            <button onClick={() => setZoom(prev => Math.min(150, prev + 10))} className="hover:bg-slate-700 p-1 rounded-full text-slate-300 hover:text-white"><Plus size={14} /></button>
                        </div>

                        <div className="overflow-auto w-full h-full flex items-start justify-center p-8 pb-32 no-scrollbar">
                            {/* The Paper - Auto Height, Min A4 */}
                            <div
                                className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out flex-shrink-0"
                                style={{
                                    width: '210mm',
                                    minHeight: '297mm',
                                    height: 'auto',
                                    transform: `scale(${zoom / 100})`
                                }}
                            >
                                <div className="p-12 pl-16 pr-16 flex flex-col h-full text-[#1e293b] font-sans">

                                    {/* Header (Clean White + Blue Text) */}
                                    <div className="mb-12">
                                        <h1 className="text-[32px] font-extrabold text-[#1e3a8a] mb-1 tracking-tight leading-none">{resumeData.personalInfo.fullName}</h1>
                                        <p className="text-lg font-bold text-[#4560b5] tracking-wide">{resumeData.personalInfo.role}</p>
                                    </div>

                                    <div className="flex flex-col gap-12">

                                        {/* DADOS PESSOAIS */}
                                        <div>
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">Dados Pessoais</h3>
                                            <div className="text-xs text-slate-600 space-y-1.5 font-medium leading-relaxed">
                                                {resumeData.personalInfo.email && <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">E-mail:</span> {resumeData.personalInfo.email}</div>}
                                                {resumeData.personalInfo.phone && <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">Telefone:</span> {resumeData.personalInfo.phone}</div>}
                                                {resumeData.personalInfo.nationality && <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">Nacionalidade:</span> {resumeData.personalInfo.nationality}</div>}
                                                {(resumeData.personalInfo.locations || []).length > 0 && (
                                                    <div className="flex gap-1">
                                                        <span className="font-bold text-[#1e3a8a] whitespace-nowrap">Endereço:</span>
                                                        <span>{(resumeData.personalInfo.locations || []).join(' • ')}</span>
                                                    </div>
                                                )}
                                                {enabledSocials.linkedin && resumeData.personalInfo.linkedin && (
                                                    <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">LinkedIn:</span> <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.personalInfo.linkedin}</a></div>
                                                )}
                                                {enabledSocials.portfolio && resumeData.personalInfo.portfolio && (
                                                    <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">Portfólio:</span> <a href={resumeData.personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.personalInfo.portfolio}</a></div>
                                                )}
                                                {enabledSocials.instagram && resumeData.personalInfo.instagram && (
                                                    <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">Instagram:</span> {resumeData.personalInfo.instagram}</div>
                                                )}
                                                {enabledSocials.youtube && resumeData.personalInfo.youtube && (
                                                    <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">YouTube:</span> {resumeData.personalInfo.youtube}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* SOBRE MIM */}
                                        {resumeData.personalInfo.summary && (
                                            <div>
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-3">Sobre Mim</h3>
                                                <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                                                    {resumeData.personalInfo.summary}
                                                </div>
                                            </div>
                                        )}

                                        {/* EXPERIÊNCIA (New Layout: Title Full Row, Content Split Below) */}
                                        {resumeData.experience.length > 0 && (
                                            <div>
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-6">Experiência</h3>
                                                <div className="space-y-8">
                                                    {resumeData.experience.map((exp, i) => (
                                                        <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                                                            {/* Left: Date & Location */}
                                                            <div className="text-right">
                                                                <div className="text-[10px] font-bold text-[#4560b5] mb-1">{exp.location}</div>
                                                                <div className="text-[10px] text-slate-400 italic">{exp.date}</div>
                                                            </div>
                                                            {/* Right: Role, Company, Desc */}
                                                            <div>
                                                                <h4 className="text-[12px] font-extrabold text-[#1e3a8a] mb-0.5">{exp.position}</h4>
                                                                <p className="text-[11px] font-bold text-slate-500 mb-2">{exp.company}</p>
                                                                <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* EDUCAÇÃO */}
                                        {resumeData.education.length > 0 && (
                                            <div>
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-6">Educação</h3>
                                                <div className="space-y-5">
                                                    {resumeData.education.map((edu, i) => (
                                                        <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                                                            <div className="text-right">
                                                                <div className="text-[10px] font-bold text-[#4560b5] mb-1">{edu.location}</div>
                                                                <div className="text-[10px] text-slate-400 italic">{edu.date}</div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[12px] font-extrabold text-[#1e3a8a] mb-0.5">{edu.degree}</h4>
                                                                <p className="text-[11px] text-slate-500 font-medium">{edu.school}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* SKILLS & IDIOMAS */}
                                        {(resumeData.languages.length > 0 || resumeData.skills.length > 0) && (
                                            <div className="grid grid-cols-2 gap-10 pt-4">
                                                {resumeData.languages.length > 0 && (
                                                    <div>
                                                        <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">Idiomas</h3>
                                                        <div className="space-y-3">
                                                            {resumeData.languages.map((lang, i) => (
                                                                <div key={i}>
                                                                    <span className="text-[11px] font-bold text-[#2563eb] block mb-0.5">{lang.name}</span>
                                                                    <span className="text-[10px] text-slate-500 block">{lang.level}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {resumeData.skills.length > 0 && (
                                                    <div>
                                                        <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">Habilidades</h3>
                                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                            {resumeData.skills.map((skill, i) => (
                                                                <span key={i} className="text-[11px] font-bold text-[#2563eb] break-words">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Editor
