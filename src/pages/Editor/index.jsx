
import React, { useState, useEffect } from 'react'
import {
    Download, UploadCloud, ChevronDown, PlusCircle, Trash2,
    Mail, Phone, MapPin, Briefcase, GraduationCap,
    Wrench, User, Star, Minus, Plus, FileText, Globe
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
        phone: '11951565851',
        linkedin: 'https://www.linkedin.com/in/victorhugo/',
        portfolio: '',
        instagram: '',
        youtube: '',
        locations: ['São Paulo / Betim - Brasil'],
        nationality: 'Brasileiro',
        summary: 'Product Designer (UX/UI) com sólido background como desenvolvedor Front-End e paixão por solucionar quebra-cabeças complexos.\n\nEspecialista em equilibrar requisitos de conformidade e segurança com experiências de usuário fluidas em setores de alta criticidade como Fintechs, Betting e Saúde.'
    },
    experience: [
        {
            id: 1,
            company: 'Entain',
            position: 'Product Designer Especialista',
            date: 'Ago 2024 - Jan 2026',
            location: 'São Paulo, Brasil',
            description: '• Conformidade e UX: Liderança de migração e validação legal das plataformas para o mercado brasileiro.\n• Retenção e Engajamento: Otimização da experiência na área de Cassino, focando na fidelização do usuário.'
        },
        {
            id: 2,
            company: 'Vivo Telefônica Brasil',
            position: 'Product Design Specialist',
            date: 'Mar 2023 - Jul 2024',
            location: 'São Paulo, Brasil',
            description: '• Infraestrutura Fintech: Liderança no design da área de fintech, incluindo a criação da conta digital.\n• Branding de Operações: Desenvolvimento de nova identidade visual.'
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
    skills: ['UX/UI Design', 'Design System', 'Prototipagem', 'Curioso', 'Autodidata', 'Testes de usabilidade'],
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

    const handleImport = async (file) => {
        // setIsImportModalOpen(false)
        setIsAiLoading(true)
        try {
            const { parseResume } = await import('../../services/localPdfParser')
            const extractedData = await parseResume(file)
            setResumeData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, ...extractedData.personalInfo },
                experience: extractedData.experience.length ? extractedData.experience.map((e, i) => ({ ...e, id: i })) : prev.experience,
                education: extractedData.education.length ? extractedData.education.map((e, i) => ({ ...e, id: i })) : prev.education,
                skills: extractedData.skills.length ? extractedData.skills : prev.skills
            }))
            alert('Sucesso! PDF lido localmente! ⚡')
        } catch (error) {
            console.error(error)
            alert('Erro ao ler o PDF: ' + error.message)
        } finally {
            setIsAiLoading(false)
        }
    }

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
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-hidden">
            {/* <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} /> */}

            {/* Top Bar - White */}
            <header className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 h-16 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 bg-blue-600 rounded-lg text-white">
                        <FileText size={20} />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Novo currículo</h1>
                        <span className="text-[10px] text-slate-400">Rascunho criado agora</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-4">
                        <span className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs border border-orange-200">
                            RS
                        </span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Ricardo Silva</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                    <button className="flex h-9 items-center justify-center rounded-lg px-4 bg-[#0ea5e9] text-white text-sm font-semibold transition-all hover:bg-[#0284c7] shadow-sm gap-2">
                        <Download size={16} /> <span>Exportar PDF</span>
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[380px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10">
                    <div className="flex-1 overflow-y-auto no-scrollbar p-0">

                        {/* Header Sidebar */}
                        <div className="p-6 pb-2">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText size={16} className="text-blue-500" />
                                Conteúdo do Currículo
                            </h2>
                        </div>

                        {/* Resume Strength */}
                        <div className="mx-6 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Força do currículo</span>
                                <span className="text-xs font-bold text-emerald-500">{strength}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${strength}%` }}></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 leading-tight">Adicione mais informações para aumentar suas chances.</p>
                        </div>

                        <div className="px-6 pb-6 space-y-3">
                            {/* Import Button */}
                            <button onClick={() => alert("Import Coming Soon")} className="w-full h-10 flex items-center justify-center gap-2 bg-[#0ea5e9] text-white rounded-lg text-sm font-bold hover:bg-[#0284c7] transition-colors shadow-sm mb-4">
                                <UploadCloud size={16} /> Importar Currículo
                            </button>

                            {/* Personal Info */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button onClick={() => toggleSection('personal')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left bg-blue-50/50">
                                    <div className="flex items-center gap-3">
                                        <User size={18} className="text-blue-500" />
                                        <span className="font-bold text-sm text-slate-800">Dados Pessoais</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'personal' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeSection === 'personal' && (
                                    <div className="p-4 pt-2 space-y-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nome Completo</label>
                                                <input className="input-field w-full" value={resumeData.personalInfo.fullName} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Cargo</label>
                                                <input className="input-field w-full" value={resumeData.personalInfo.role} onChange={(e) => handleChange('personalInfo', 'role', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">E-mail</label>
                                                <input className="input-field w-full" value={resumeData.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Telefone</label>
                                                <input className="input-field w-full" value={resumeData.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nacionalidade</label>
                                                <input className="input-field w-full" value={resumeData.personalInfo.nationality} onChange={(e) => handleChange('personalInfo', 'nationality', e.target.value)} />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Localização</label>
                                                <div className="space-y-2">
                                                    {(resumeData.personalInfo.locations || []).map((loc, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <input className="input-field w-full" value={loc} onChange={(e) => handleLocationChange(i, e.target.value)} />
                                                            <button onClick={() => removeLocation(i)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                    <button onClick={addLocation} className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1">+ Adicionar Local</button>
                                                </div>
                                            </div>

                                            {/* Social Toggles */}
                                            <div className="pt-2 space-y-2">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 border-slate-300" checked={enabledSocials.linkedin} onChange={() => toggleSocial('linkedin')} />
                                                    <FileText size={14} className="text-slate-500 group-hover:text-blue-600" />
                                                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">LinkedIn</span>
                                                </label>
                                                {enabledSocials.linkedin && (
                                                    <input className="input-field w-full" placeholder="URL do LinkedIn" value={resumeData.personalInfo.linkedin} onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} />
                                                )}

                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 border-slate-300" checked={enabledSocials.portfolio} onChange={() => toggleSocial('portfolio')} />
                                                    <FileText size={14} className="text-slate-500 group-hover:text-blue-600" />
                                                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">Portfólio</span>
                                                </label>
                                                {enabledSocials.portfolio && (
                                                    <input className="input-field w-full" placeholder="URL do Portfólio" value={resumeData.personalInfo.portfolio} onChange={(e) => handleChange('personalInfo', 'portfolio', e.target.value)} />
                                                )}

                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500 border-slate-300" checked={enabledSocials.instagram} onChange={() => toggleSocial('instagram')} />
                                                    <FileText size={14} className="text-slate-500 group-hover:text-pink-600" />
                                                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">Instagram</span>
                                                </label>
                                                {enabledSocials.instagram && (
                                                    <input className="input-field w-full" placeholder="@usuario" value={resumeData.personalInfo.instagram} onChange={(e) => handleChange('personalInfo', 'instagram', e.target.value)} />
                                                )}

                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="checkbox" className="rounded text-red-500 focus:ring-red-500 border-slate-300" checked={enabledSocials.youtube} onChange={() => toggleSocial('youtube')} />
                                                    <FileText size={14} className="text-slate-500 group-hover:text-red-600" />
                                                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">YouTube</span>
                                                </label>
                                                {enabledSocials.youtube && (
                                                    <input className="input-field w-full" placeholder="URL do Canal" value={resumeData.personalInfo.youtube} onChange={(e) => handleChange('personalInfo', 'youtube', e.target.value)} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sobre Mim */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button onClick={() => toggleSection('summary')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-slate-400" />
                                        <span className="font-bold text-sm text-slate-700">Sobre mim</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'summary' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeSection === 'summary' && (
                                    <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <textarea className="input-field w-full min-h-[120px]" placeholder="Breve resumo..." value={resumeData.personalInfo.summary} onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)} />
                                    </div>
                                )}
                            </div>

                            {/* Experiência */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button onClick={() => toggleSection('experience')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={18} className="text-slate-400" />
                                        <span className="font-bold text-sm text-slate-700">Experiência Profissional</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'experience' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeSection === 'experience' && (
                                    <div className="p-4 pt-2 space-y-4 border-t border-slate-100">
                                        {resumeData.experience.map((exp, i) => (
                                            <div key={exp.id || i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg relative group">
                                                <button onClick={() => removeItem('experience', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                <input className="input-field mb-2 font-bold bg-white" placeholder="Cargo" value={exp.position} onChange={(e) => handleArrayChange('experience', i, 'position', e.target.value)} />
                                                <input className="input-field mb-2 bg-white" placeholder="Empresa" value={exp.company} onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)} />
                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    <input className="input-field bg-white" placeholder="Período" value={exp.date} onChange={(e) => handleArrayChange('experience', i, 'date', e.target.value)} />
                                                    <input className="input-field bg-white" placeholder="Local" value={exp.location} onChange={(e) => handleArrayChange('experience', i, 'location', e.target.value)} />
                                                </div>
                                                <textarea className="input-field text-xs bg-white" rows="3" placeholder="Descrição..." value={exp.description} onChange={(e) => handleArrayChange('experience', i, 'description', e.target.value)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('experience', { company: '', position: '', date: '', location: '', description: '' })} className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 border border-dashed border-slate-300">
                                            <PlusCircle size={14} /> Adicionar Experiência
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Escolaridade */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button onClick={() => toggleSection('education')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <GraduationCap size={18} className="text-slate-400" />
                                        <span className="font-bold text-sm text-slate-700">Escolaridade</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'education' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeSection === 'education' && (
                                    <div className="p-4 pt-2 space-y-4 border-t border-slate-100">
                                        {resumeData.education.map((edu, i) => (
                                            <div key={edu.id || i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg relative group">
                                                <button onClick={() => removeItem('education', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                <input className="input-field mb-2 font-bold bg-white" placeholder="Curso" value={edu.degree} onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)} />
                                                <input className="input-field mb-2 bg-white" placeholder="Escola" value={edu.school} onChange={(e) => handleArrayChange('education', i, 'school', e.target.value)} />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input className="input-field bg-white" placeholder="Período" value={edu.date} onChange={(e) => handleArrayChange('education', i, 'date', e.target.value)} />
                                                    <input className="input-field bg-white" placeholder="Local" value={edu.location} onChange={(e) => handleArrayChange('education', i, 'location', e.target.value)} />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('education', { school: '', degree: '', date: '', location: '' })} className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 border border-dashed border-slate-300">
                                            <PlusCircle size={14} /> Adicionar Educação
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Habilidades */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button onClick={() => toggleSection('skills')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <Wrench size={18} className="text-slate-400" />
                                        <span className="font-bold text-sm text-slate-700">Habilidades</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'skills' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeSection === 'skills' && (
                                    <div className="p-4 pt-2 space-y-3 border-t border-slate-100">
                                        <div className="flex flex-wrap gap-2">
                                            {resumeData.skills.map((skill, i) => (
                                                <div key={i} className="flex items-center bg-white border border-slate-200 rounded-lg pl-3 pr-1 py-1">
                                                    <input className="text-xs font-semibold text-slate-700 w-full bg-transparent outline-none min-w-[50px] max-w-[120px]" value={skill} onChange={(e) => handleSkillChange(i, e.target.value)} />
                                                    <button onClick={() => {
                                                        const newSkills = resumeData.skills.filter((_, idx) => idx !== i)
                                                        setResumeData(prev => ({ ...prev, skills: newSkills }))
                                                    }} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setResumeData(prev => ({ ...prev, skills: [...prev.skills, 'Nova Habilidade'] }))} className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1">+ Adicionar Habilidade</button>
                                    </div>
                                )}
                            </div>

                            {/* Idiomas */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button onClick={() => toggleSection('languages')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-slate-400" />
                                        <span className="font-bold text-sm text-slate-700">Idioma</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'languages' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeSection === 'languages' && (
                                    <div className="p-4 pt-2 space-y-3 border-t border-slate-100">
                                        {resumeData.languages.map((lang, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input className="input-field w-1/2" placeholder="Idioma" value={lang.name} onChange={(e) => handleArrayChange('languages', i, 'name', e.target.value)} />
                                                <input className="input-field w-1/2" placeholder="Nível" value={lang.level} onChange={(e) => handleArrayChange('languages', i, 'level', e.target.value)} />
                                                <button onClick={() => removeItem('languages', i)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('languages', { name: '', level: '' })} className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 border border-dashed border-slate-300">
                                            <PlusCircle size={14} /> Adicionar Idioma
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Custom Section Button */}
                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors">
                                <PlusCircle size={16} /> Adicionar Seção Personalizada
                            </button>

                        </div>
                    </div>

                    {/* Footer Plan Info */}
                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-blue-900 dark:text-blue-100 uppercase">Plano Gratuito</span>
                            </div>
                            <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">1 de 2 currículos criados</p>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                Fazer upgrade <span className="text-lg leading-none">→</span>
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Preview Area */}
                <section className="flex-1 bg-[#525659] h-full overflow-hidden relative flex flex-col items-center justify-center p-8">

                    {/* Zoom Controls */}
                    <div className="absolute bottom-8 z-50 bg-[#1e293b] text-white px-2 py-1.5 rounded-full flex items-center gap-3 shadow-lg border border-slate-600">
                        <button onClick={() => setZoom(prev => Math.max(50, prev - 10))} className="hover:bg-slate-700 p-1 rounded-full"><Minus size={14} /></button>
                        <span className="text-xs font-bold min-w-[40px] text-center">{zoom}%</span>
                        <button onClick={() => setZoom(prev => Math.min(150, prev + 10))} className="hover:bg-slate-700 p-1 rounded-full"><Plus size={14} /></button>
                    </div>

                    <div className="overflow-auto w-full h-full flex items-start justify-center p-8 no-scrollbar">
                        {/* The Paper */}
                        <div
                            className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out flex-shrink-0"
                            style={{
                                width: '210mm',
                                height: '297mm',
                                transform: `scale(${zoom / 100})`
                            }}
                        >
                            <div className="p-12 flex flex-col h-full text-[#1e293b] font-sans">

                                {/* Header (Clean White) */}
                                <div className="mb-14">
                                    <h1 className="text-4xl font-extrabold text-[#1e3a8a] mb-2">{resumeData.personalInfo.fullName}</h1>
                                    <p className="text-lg font-bold text-[#1e3a8a]">{resumeData.personalInfo.role}</p>
                                </div>

                                <div className="flex flex-col gap-10">

                                    {/* Dados Pessoais */}
                                    <div className="grid grid-cols-[180px_1fr] gap-6 border-b border-slate-100 pb-8">
                                        <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-wider pt-1">Dados Pessoais</h3>
                                        <div className="text-xs text-slate-600 space-y-1.5 font-medium">
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
                                                <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">LinkedIn:</span> {resumeData.personalInfo.linkedin}</div>
                                            )}
                                            {enabledSocials.portfolio && resumeData.personalInfo.portfolio && (
                                                <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">Portfólio:</span> {resumeData.personalInfo.portfolio}</div>
                                            )}
                                            {enabledSocials.instagram && resumeData.personalInfo.instagram && (
                                                <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">Instagram:</span> {resumeData.personalInfo.instagram}</div>
                                            )}
                                            {enabledSocials.youtube && resumeData.personalInfo.youtube && (
                                                <div className="flex gap-1"><span className="font-bold text-[#1e3a8a]">YouTube:</span> {resumeData.personalInfo.youtube}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sobre Mim */}
                                    {resumeData.personalInfo.summary && (
                                        <div className="grid grid-cols-[180px_1fr] gap-6 border-b border-slate-100 pb-8">
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-wider pt-1">Sobre Mim</h3>
                                            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                                                {resumeData.personalInfo.summary}
                                            </div>
                                        </div>
                                    )}

                                    {/* Experiência */}
                                    {resumeData.experience.length > 0 && (
                                        <div className="grid grid-cols-[180px_1fr] gap-6 border-b border-slate-100 pb-8">
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-wider pt-1">Experiência</h3>
                                            <div className="space-y-6">
                                                {resumeData.experience.map((exp, i) => (
                                                    <div key={i} className="relative">
                                                        <div className="absolute -left-[204px] w-[180px] text-right">
                                                            <div className="text-[11px] font-bold text-[#2563eb]">{exp.location}</div>
                                                            <div className="text-[10px] text-slate-400 italic">{exp.date}</div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-extrabold text-[#1e3a8a]">{exp.position}</h4>
                                                            <p className="text-xs text-slate-500 font-semibold mb-2">{exp.company}</p>
                                                            <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Educação */}
                                    {resumeData.education.length > 0 && (
                                        <div className="grid grid-cols-[180px_1fr] gap-6 border-b border-slate-100 pb-8">
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-wider pt-1">Educação</h3>
                                            <div className="space-y-4">
                                                {resumeData.education.map((edu, i) => (
                                                    <div key={i} className="relative">
                                                        <div className="absolute -left-[204px] w-[180px] text-right">
                                                            <div className="text-[11px] font-bold text-[#2563eb]">{edu.location}</div>
                                                            <div className="text-[10px] text-slate-400 italic">{edu.date}</div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-extrabold text-[#1e3a8a]">{edu.degree}</h4>
                                                            <p className="text-xs text-slate-500">{edu.school}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills & Langs */}
                                    <div className="grid grid-cols-2 gap-10">
                                        {resumeData.languages.length > 0 && (
                                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-wider pt-1">Idiomas</h3>
                                                <div className="space-y-1">
                                                    {resumeData.languages.map((lang, i) => (
                                                        <div key={i} className="text-xs">
                                                            <span className="font-bold text-[#2563eb] block">{lang.name}</span>
                                                            <span className="text-slate-500 block text-[10px]">{lang.level}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {resumeData.skills.length > 0 && (
                                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-wider pt-1">Habilidades</h3>
                                                <div className="flex flex-col gap-1">
                                                    {resumeData.skills.map((skill, i) => (
                                                        <span key={i} className="text-xs font-bold text-[#2563eb]">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Editor
