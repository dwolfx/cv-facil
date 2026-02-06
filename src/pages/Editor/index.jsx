import React, { useState, useEffect } from 'react'
import {
    Download, UploadCloud, ChevronDown, PlusCircle, Trash2,
    Mail, Phone, MapPin, Briefcase, GraduationCap,
    Wrench, User, Star, Minus, Plus, FileText, Globe,
    Layout, Settings, Bold, List, Edit2, Save, Loader2, RefreshCw
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'sonner'
import './Editor.css'

// Initial State 
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
            startDate: '08/2024',
            endDate: '',
            isCurrent: true,
            location: 'Remoto',
            description: '• Conformidade e UX: Liderança da migração e validação legal das plataformas para o mercado brasileiro, garantindo aderência total à legislação local.\n• Retenção e Engajamento: Otimização da experiência na área de Cassino, focando na fidelização do usuário e impulsionando o crescimento trimestral da plataforma.'
        },
        {
            id: 2,
            company: 'Vivo (Telefônica Brasil)',
            position: 'Product Design Specialist',
            startDate: '03/2023',
            endDate: '07/2024',
            isCurrent: false,
            location: 'São Paulo, Brasil',
            description: '• Infraestrutura Fintech: Liderança no design da área de fintech, incluindo a criação da conta digital e integração com o sistema PIX segundo as normas do Banco Central.\n• Cartões de Crédito: Definição da estratégia de design para o lançamento da nova área de cartões, criando interfaces intuitivas para o aplicativo e portal do cliente.\n• Branding de Operações: Desenvolvimento de nova identidade visual e linguagem de design para modernizar a imagem da área no mercado.'
        },
        {
            id: 3,
            company: 'Banco Bradesco',
            position: 'Product Designer Especialista',
            startDate: '12/2022',
            endDate: '03/2023',
            isCurrent: false,
            location: 'São Paulo, Brasil',
            description: '• Foco B2B e Eficiência: Otimização da experiência do vendedor em lojas de veículos, agilizando o processo de contratação sem abrir mão das normas bancárias.\n• Mentoria Técnica: Mentoria de designers juniores durante o desenvolvimento da plataforma Autoline, preservando a identidade da marca e auxiliando no desenvolvimento da carreira deles.'
        }
    ],
    education: [
        {
            id: 1,
            school: 'Awari',
            degree: 'Product Designer Specialist',
            startDate: '01/2019',
            endDate: '12/2021',
            isCurrent: false,
            location: 'São Paulo, Brasil'
        },
        {
            id: 2,
            school: 'Centro Educacional SENAC',
            degree: 'Gestão de Tecnologia da Informação',
            startDate: '06/2010',
            endDate: '12/2013',
            isCurrent: false,
            location: 'São Paulo, Brasil'
        }
    ],
    skills: ['Auto-didata', 'UX/UI Design', 'Testes de usabilidade', 'Design System', 'Mentoria profissional', 'Prototipagem', 'Pesquisa de mercado', 'Curioso'],
    languages: [
        { id: 1, name: 'Inglês', level: 'Avançado' },
        { id: 2, name: 'Espanhol', level: 'Intermediário' }
    ]
}

import Sidebar from '../../components/Sidebar'
import UserDropdown from '../../components/UserDropdown'
import Header from '../../components/Header'
import PlanWidget from '../../components/PlanWidget' // Assuming this component exists and is needed

const Editor = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const resumeId = searchParams.get('id')

    const [resumeData, setResumeData] = useState(initialResumeState)
    const [activeSection, setActiveSection] = useState('personal')
    const [zoom, setZoom] = useState(100)
    const [activeMobileTab, setActiveMobileTab] = useState('edit') // 'edit' | 'preview'
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(!!resumeId)

    // Fetch Resume if ID is present
    useEffect(() => {
        if (resumeId && user) {
            fetchResume(resumeId)
        } else {
            setLoading(false)
        }
    }, [resumeId, user])

    const fetchResume = async (id) => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            if (data && data.content) {
                setResumeData(data.content)
            }
        } catch (error) {
            console.error('Error fetching resume:', error)
            toast.error('Erro ao carregar currículo.')
            navigate('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    // Auto-set zoom for mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // Approximate scale for mobile logic
                const idealZoom = Math.floor((window.innerWidth - 32) / 800 * 100)
                setZoom(Math.max(30, idealZoom))
            } else {
                setZoom(100)
            }
        }
        handleResize()
    }, [])

    // Socials visibility toggle state
    const [enabledSocials, setEnabledSocials] = useState({
        linkedin: true,
        portfolio: false,
        instagram: false,
        youtube: false
    })

    // Formatting Functions
    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '')
        const truncated = digits.slice(0, 11)
        if (truncated.length > 10) return truncated.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
        else if (truncated.length > 5) return truncated.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
        else if (truncated.length > 2) return truncated.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
        return truncated
    }

    const formatDateInput = (value) => {
        const digits = value.replace(/\D/g, '')
        const truncated = digits.slice(0, 6)
        if (truncated.length > 2) {
            return `${truncated.slice(0, 2)}/${truncated.slice(2)}`
        }
        return truncated
    }

    const formatPreviewDate = (dateString) => {
        if (!dateString) return ''
        const parts = dateString.split('/')
        if (parts.length < 2) return dateString
        const month = parseInt(parts[0], 10)
        const year = parts[1]
        if (isNaN(month) || month < 1 || month > 12) return dateString
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        return `${months[month - 1]} ${year}`
    }

    const renderDateRange = (start, end, isCurrent) => {
        const s = formatPreviewDate(start)
        const e = isCurrent ? 'Presente' : formatPreviewDate(end)
        if (!s && !e) return ''
        if (s && !e) return s
        if (!s && e) return e
        return `${s} - ${e}`
    }

    // Rich Text Rendering Helper
    const renderRichText = (text) => {
        if (!text) return null
        return text.split('\n').map((line, i) => {
            // Simple robust parser for <b> tags
            const parts = line.split(/(<b>.*?<\/b>)/g)
            return (
                <p key={i} className="mb-1 min-h-[1em]">
                    {parts.map((part, j) => {
                        if (part.startsWith('<b>') && part.endsWith('</b>')) {
                            return <span key={j} className="font-bold">{part.replace(/<\/?b>/g, '')}</span>
                        }
                        return part
                    })}
                </p>
            )
        })
    }

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

    const handleSave = async () => {
        if (!user) return
        setSubmitting(true)

        try {
            const resumeToSave = {
                user_id: user.id,
                title: resumeData.personalInfo.role || 'Sem Título',
                content: resumeData,
                strength: strength,
                updated_at: new Date()
            }

            let error
            let data

            if (resumeId) {
                // Update
                const res = await supabase
                    .from('resumes')
                    .update(resumeToSave)
                    .eq('id', resumeId)
                    .select()
                error = res.error
                data = res.data
            } else {
                // Insert
                const res = await supabase
                    .from('resumes')
                    .insert(resumeToSave)
                    .select()
                error = res.error
                data = res.data
            }

            if (error) throw error

            toast.success('Currículo salvo com sucesso!')

            // If new resume, redirect to URL with ID
            if (!resumeId && data && data[0]) {
                navigate(`/editor?id=${data[0].id}`, { replace: true })
            }

        } catch (error) {
            console.error('Error saving resume:', error)
            toast.error('Erro ao salvar currículo.')
        } finally {
            setSubmitting(false)
        }
    }

    const toggleSection = (section) => setActiveSection(activeSection === section ? null : section)

    const handleChange = (section, field, value) => {
        let finalValue = value;
        if (field === 'phone') finalValue = formatPhone(value)
        setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [field]: finalValue } }))
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
            let finalValue = value
            if (field === 'startDate' || field === 'endDate') {
                finalValue = formatDateInput(value)
            }
            newArray[index] = { ...newArray[index], [field]: finalValue }
            if (field === 'isCurrent' && value === true) {
                newArray[index].endDate = ''
                if (section === 'experience') {
                    newArray.forEach((item, i) => {
                        if (i !== index) item.isCurrent = false
                    })
                }
            }
            return { ...prev, [section]: newArray }
        })
    }

    // New Rich Text Handler using standard DOM API
    const handleFormat = (elementId, type, section, index, field) => {
        const el = document.getElementById(elementId)
        if (!el) return

        const start = el.selectionStart
        const end = el.selectionEnd
        const text = el.value
        const selectedText = text.substring(start, end)
        let newText = text
        let newCursorPos = end

        if (type === 'bold') {
            const before = text.substring(0, start)
            const after = text.substring(end)
            newText = `${before}<b>${selectedText}</b>${after}`
            newCursorPos = end + 7 // length of <b> and </b>
        } else if (type === 'list') {
            // Add bullet at start of line or at cursor
            // Simple version: insert bullet at cursor
            const before = text.substring(0, start)
            const after = text.substring(end)
            newText = `${before}• ${after}` // Only adds bullet, user types text
            newCursorPos = start + 2
        }

        // Trigger Update
        if (index !== undefined) {
            handleArrayChange(section, index, field, newText)
        } else {
            handleChange(section, field, newText)
        }

        // Restore focus/cursor (requires timeout due to react render)
        setTimeout(() => {
            const updatedEl = document.getElementById(elementId)
            if (updatedEl) {
                updatedEl.focus()
                updatedEl.setSelectionRange(newCursorPos, newCursorPos)
            }
        }, 0)
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
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 h-screen flex flex-row overflow-hidden pb-24 md:pb-0">
            {/* Shared Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header
                    title="Editor"
                    subtitle="Edite as informações e acompanhe o resultado em tempo real."
                    planCurrent={1}
                >
                    <button
                        onClick={handleSave}
                        disabled={submitting || loading}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-2 md:px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        <span className="hidden md:inline">Salvar</span>
                    </button>

                    <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-2 md:px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                        <Download size={14} /> <span className="hidden md:inline">Exportar PDF</span><span className="md:hidden">PDF</span>
                    </button>
                </Header>

                {/* Mobile Tabs Switcher - Separate Bar */}
                <div className="md:hidden flex items-center justify-center p-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full max-w-[280px]">
                        <button
                            onClick={() => setActiveMobileTab('edit')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeMobileTab === 'edit' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-slate-500'}`}
                        >
                            <Edit2 size={12} /> Editar
                        </button>
                        <button
                            onClick={() => setActiveMobileTab('preview')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeMobileTab === 'preview' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-slate-500'}`}
                        >
                            Visualizar
                        </button>
                    </div>
                </div>



                <main className="flex flex-1 overflow-hidden relative">
                    <aside className={`w-full md:w-[380px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10 shrink-0 ${activeMobileTab === 'edit' ? 'flex' : 'hidden md:flex'}`}>
                        <div className="flex-1 overflow-y-auto no-scrollbar p-0">
                            <div className="p-6 pb-4">
                                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Layout size={18} className="text-[var(--primary)]" />
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

                            <div className="px-6 pb-6 space-y-3">
                                {/* Personal Info */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('personal')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left bg-orange-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-1.5 rounded-md text-[var(--primary)]"><User size={16} /></div>
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
                                                    <input className="input-field-modern" type="email" value={resumeData.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">Telefone</label>
                                                    <input className="input-field-modern" maxLength="15" placeholder="(99) 99999-9999" value={resumeData.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} />
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
                                                        <button onClick={addLocation} className="text-[10px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mt-1">
                                                            <PlusCircle size={12} /> Adicionar Local
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="pt-2 space-y-3 border-t border-slate-50 mt-2">
                                                    <div className="flex flex-col gap-3">
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-[var(--primary)] focus:ring-[var(--primary)] border-slate-300 size-3.5" checked={enabledSocials.linkedin} onChange={() => toggleSocial('linkedin')} />
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-[var(--primary)]">LinkedIn</span>
                                                        </label>
                                                        {enabledSocials.linkedin && (
                                                            <input className="input-field-modern" placeholder="URL do LinkedIn" value={resumeData.personalInfo.linkedin} onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} />
                                                        )}
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-[var(--primary)] focus:ring-[var(--primary)] border-slate-300 size-3.5" checked={enabledSocials.portfolio} onChange={() => toggleSocial('portfolio')} />
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-[var(--primary)]">Portfólio</span>
                                                        </label>
                                                        {enabledSocials.portfolio && (
                                                            <input className="input-field-modern" placeholder="URL do Portfólio" value={resumeData.personalInfo.portfolio} onChange={(e) => handleChange('personalInfo', 'portfolio', e.target.value)} />
                                                        )}
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-[var(--primary)] focus:ring-[var(--primary)] border-slate-300 size-3.5" checked={enabledSocials.instagram} onChange={() => toggleSocial('instagram')} />
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-pink-600">Instagram</span>
                                                        </label>
                                                        {enabledSocials.instagram && (
                                                            <input className="input-field-modern" placeholder="@usuario" value={resumeData.personalInfo.instagram} onChange={(e) => handleChange('personalInfo', 'instagram', e.target.value)} />
                                                        )}
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="checkbox" className="rounded text-[var(--primary)] focus:ring-[var(--primary)] border-slate-300 size-3.5" checked={enabledSocials.youtube} onChange={() => toggleSocial('youtube')} />
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
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('summary')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left bg-orange-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-1.5 rounded-md text-[var(--primary)]"><FileText size={16} /></div>
                                            <span className="font-bold text-sm text-slate-800">Sobre mim</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'summary' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeSection === 'summary' && (
                                        <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex gap-2 mb-2">
                                                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('summary-input', 'bold', 'personalInfo', undefined, 'summary') }} className="p-1 hover:bg-slate-100 rounded text-slate-600"><Bold size={14} /></button>
                                                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('summary-input', 'list', 'personalInfo', undefined, 'summary') }} className="p-1 hover:bg-slate-100 rounded text-slate-600"><List size={14} /></button>
                                            </div>
                                            <textarea id="summary-input" className="input-field-modern min-h-[120px]" placeholder="Breve resumo..." value={resumeData.personalInfo.summary} onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)} />
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('experience')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left bg-orange-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-1.5 rounded-md text-[var(--primary)]"><Briefcase size={16} /></div>
                                            <span className="font-bold text-sm text-slate-800">Experiência Profissional</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === 'experience' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeSection === 'experience' && (
                                        <div className="p-4 pt-4 space-y-4 border-t border-slate-100">
                                            {resumeData.experience.map((exp, i) => (
                                                <div key={exp.id || i} className="p-4 bg-white border border-slate-200 rounded-lg relative group shadow-sm transition-all hover:border-orange-300">
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
                                                        <div>
                                                            <label className="input-label mb-1">Período</label>
                                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                                <input className="input-field-modern" placeholder="MM/AAAA" maxLength={7} value={exp.startDate} onChange={(e) => handleArrayChange('experience', i, 'startDate', e.target.value)} />
                                                                <input
                                                                    className="input-field-modern"
                                                                    placeholder="MM/AAAA"
                                                                    maxLength={7}
                                                                    value={exp.endDate}
                                                                    disabled={exp.isCurrent}
                                                                    onChange={(e) => handleArrayChange('experience', i, 'endDate', e.target.value)}
                                                                    style={{ opacity: exp.isCurrent ? 0.5 : 1, cursor: exp.isCurrent ? 'not-allowed' : 'text' }}
                                                                />
                                                            </div>
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded text-[var(--primary)] focus:ring-[var(--primary)] border-slate-300 size-3.5"
                                                                    checked={exp.isCurrent || false}
                                                                    onChange={(e) => handleArrayChange('experience', i, 'isCurrent', e.target.checked)}
                                                                />
                                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Trabalho aqui atualmente</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="input-label">Local</label>
                                                            <input className="input-field-modern" value={exp.location} onChange={(e) => handleArrayChange('experience', i, 'location', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <div className="flex gap-2 mb-1 justify-between items-end">
                                                                <label className="input-label mb-0">Descrição</label>
                                                                <div className="flex gap-2">
                                                                    <button onMouseDown={(e) => { e.preventDefault(); handleFormat(`desc-${i}`, 'bold', 'experience', i, 'description') }} className="p-1 hover:bg-slate-100 rounded text-slate-600"><Bold size={12} /></button>
                                                                    <button onMouseDown={(e) => { e.preventDefault(); handleFormat(`desc-${i}`, 'list', 'experience', i, 'description') }} className="p-1 hover:bg-slate-100 rounded text-slate-600"><List size={12} /></button>
                                                                </div>
                                                            </div>
                                                            <textarea id={`desc-${i}`} className="input-field-modern min-h-[80px]" rows="3" value={exp.description} onChange={(e) => handleArrayChange('experience', i, 'description', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', isCurrent: false, location: '', description: '' })} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 border border-dashed border-slate-300 transition-all">
                                                <PlusCircle size={14} /> Adicionar Experiência
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('education')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left bg-orange-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-1.5 rounded-md text-[var(--primary)]"><GraduationCap size={16} /></div>
                                            <span className="font-bold text-sm text-slate-800">Escolaridade</span>
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
                                                        <div>
                                                            <label className="input-label mb-1">Período</label>
                                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                                <input className="input-field-modern" placeholder="MM/AAAA" maxLength={7} value={edu.startDate} onChange={(e) => handleArrayChange('education', i, 'startDate', e.target.value)} />
                                                                <input
                                                                    className="input-field-modern"
                                                                    placeholder="MM/AAAA"
                                                                    maxLength={7}
                                                                    value={edu.endDate}
                                                                    disabled={edu.isCurrent}
                                                                    onChange={(e) => handleArrayChange('education', i, 'endDate', e.target.value)}
                                                                    style={{ opacity: edu.isCurrent ? 0.5 : 1, cursor: edu.isCurrent ? 'not-allowed' : 'text' }}
                                                                />
                                                            </div>
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded text-[var(--primary)] focus:ring-[var(--primary)] border-slate-300 size-3.5"
                                                                    checked={edu.isCurrent || false}
                                                                    onChange={(e) => handleArrayChange('education', i, 'isCurrent', e.target.checked)}
                                                                />
                                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Estudo aqui atualmente</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="input-label">Local</label>
                                                            <input className="input-field-modern" value={edu.location} onChange={(e) => handleArrayChange('education', i, 'location', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => addItem('education', { school: '', degree: '', startDate: '', endDate: '', isCurrent: false, location: '' })} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 border border-dashed border-slate-300 transition-all">
                                                <PlusCircle size={14} /> Adicionar Educação
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button onClick={() => toggleSection('skills')} className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left bg-orange-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-1.5 rounded-md text-[var(--primary)]"><Wrench size={16} /></div>
                                            <span className="font-bold text-sm text-slate-800">Habilidades</span>
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
                                            <button onClick={() => setResumeData(prev => ({ ...prev, skills: [...prev.skills, 'Nova Habilidade'] }))} className="text-xs font-bold text-[var(--primary)] hover:text-orange-600 flex items-center gap-1 mt-2">
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
                        <div className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 z-20 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 shadow-sm relative overflow-hidden">
                                <span className="text-[10px] font-bold text-[var(--primary)] dark:text-orange-100 uppercase block mb-1">Plano Gratuito</span>
                                <div className="w-full h-1.5 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '50%' }}></div>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-medium">1 de 2 currículos criados</p>
                                <a href="/upgrade" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                                    Fazer upgrade <span className="text-lg leading-none">→</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Preview Area */}
                    <section className={`flex-1 bg-[#525659] h-full overflow-hidden relative flex-col items-center justify-start pt-6 md:pt-10 pb-20 ${activeMobileTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
                        <div className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 md:translate-x-[100px] z-50 bg-[#1e293b] text-white px-2 py-1.5 rounded-full flex items-center gap-3 shadow-2xl border border-slate-600">
                            <button onClick={() => setZoom(prev => Math.max(50, prev - 10))} className="hover:bg-slate-700 p-1 rounded-full text-slate-300 hover:text-white"><Minus size={14} /></button>
                            <span className="text-xs font-bold min-w-[40px] text-center">{zoom}%</span>
                            <button onClick={() => setZoom(prev => Math.min(150, prev + 10))} className="hover:bg-slate-700 p-1 rounded-full text-slate-300 hover:text-white"><Plus size={14} /></button>
                        </div>
                        <div className="overflow-auto w-full h-full flex items-start justify-center p-4 md:p-8 pb-32 no-scrollbar">
                            <div
                                className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out flex-shrink-0"
                                style={{
                                    width: '210mm',
                                    minHeight: '297mm',
                                    height: 'auto',
                                    transform: `scale(${zoom / 100})`
                                }}
                            >
                                <div className="p-0 flex flex-col h-full text-[#1e293b] font-sans">
                                    {/* Header with background - Added padding and bg */}
                                    <div className="mb-12 bg-slate-50 px-16 py-12 border-b border-slate-100">
                                        <h1 className="text-[32px] font-extrabold text-[#1e3a8a] mb-0 tracking-tight leading-none">{resumeData.personalInfo.fullName}</h1>
                                        <p className="text-base font-bold text-[#4560b5] tracking-wide mt-1">{resumeData.personalInfo.role}</p>
                                    </div>
                                    <div className="flex flex-col gap-10 px-16 pb-16">
                                        {/* DADOS PESSOAIS */}
                                        <div>
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Dados Pessoais</h3>
                                            <div className="grid grid-cols-[140px_1fr] gap-6">
                                                <div className="text-right"></div>
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
                                                </div>
                                            </div>
                                        </div>

                                        {/* SOBRE MIM */}
                                        {resumeData.personalInfo.summary && (
                                            <div>
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Sobre Mim</h3>
                                                <div className="grid grid-cols-[140px_1fr] gap-6">
                                                    <div className="text-right"></div>
                                                    <div className="text-[11px] text-slate-600 leading-relaxed text-justify">
                                                        {renderRichText(resumeData.personalInfo.summary)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* EXPERIÊNCIA */}
                                        {resumeData.experience.length > 0 && (
                                            <div>
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Experiência</h3>
                                                <div className="space-y-6">
                                                    {resumeData.experience.map((exp, i) => (
                                                        <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                                                            <div className="text-right">
                                                                <div className="text-[10px] font-bold text-[#4560b5] mb-1">{exp.location}</div>
                                                                <div className="text-[10px] text-slate-400 italic">
                                                                    {renderDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[12px] font-extrabold text-[#1e3a8a] mb-0.5">{exp.position}</h4>
                                                                <p className="text-[11px] font-bold text-slate-500 mb-2">{exp.company}</p>
                                                                <div className="text-[11px] text-slate-600 leading-relaxed text-justify">
                                                                    {renderRichText(exp.description)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* EDUCAÇÃO */}
                                        {resumeData.education.length > 0 && (
                                            <div>
                                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Educação</h3>
                                                <div className="space-y-5">
                                                    {resumeData.education.map((edu, i) => (
                                                        <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                                                            <div className="text-right">
                                                                <div className="text-[10px] font-bold text-[#4560b5] mb-1">{edu.location}</div>
                                                                <div className="text-[10px] text-slate-400 italic">
                                                                    {renderDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                                                                </div>
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

                                        {/* SKILLS & IDIOMAS - Left Aligned Flex */}
                                        {(resumeData.languages.length > 0 || resumeData.skills.length > 0) && (
                                            <div className="grid grid-cols-[140px_1fr] gap-6 border-t border-gray-100 pt-6">
                                                <div className="text-right">
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
                                                </div>
                                                {/* Flex instead of Grid for left align */}
                                                <div className="flex gap-16">
                                                    {resumeData.skills.length > 0 && (
                                                        <div>
                                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">Habilidades</h3>
                                                            <div className="grid grid-cols-2 gap-y-2 gap-x-16">
                                                                {resumeData.skills.map((skill, i) => (
                                                                    <span key={i} className="text-[11px] font-bold text-[#2563eb] break-words">{skill}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div >
    )
}

export default Editor
