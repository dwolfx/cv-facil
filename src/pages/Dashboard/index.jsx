
import React, { useState, useEffect, useRef } from 'react'
import { Loader2, Trash2, FileText, UploadCloud, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import PlanWidget from '../../components/PlanWidget'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { useUserPlan } from '../../hooks/useUserPlan'
import { generateResumePDF } from '../../utils/pdfGenerator'
import { translateResume } from '../../services/translationService'
import { parseResume } from '../../services/localPdfParser'

// Modular Components
import ResumeCard from './components/ResumeCard'
import NewResumeCard from './components/NewResumeCard'

const Dashboard = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [resumes, setResumes] = useState([])
    const [loading, setLoading] = useState(true)

    // Use hook for limits
    const { features } = useUserPlan(user)
    const planLimit = features.maxResumes

    const [openMenuId, setOpenMenuId] = useState(null)
    const [renamingId, setRenamingId] = useState(null)
    const [tempTitle, setTempTitle] = useState('')
    const [showNewModal, setShowNewModal] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const fileInputRef = useRef(null)

    const isAtLimit = resumes.length >= planLimit

    const handleDownload = (resume) => {
        if (!resume.content) return toast.error('Conteúdo vazio ou inválido.')
        try {
            toast.promise(
                async () => generateResumePDF(resume.content, resume.title),
                {
                    loading: 'Gerando PDF...',
                    success: 'Download iniciado!',
                    error: 'Erro ao gerar PDF.'
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    const handleMenuClick = (e, id) => {
        e.stopPropagation()
        setOpenMenuId(openMenuId === id ? null : id)
    }

    const startRenaming = (e, resume) => {
        e.stopPropagation()
        setRenamingId(resume.id)
        setTempTitle(resume.title || 'Sem Título')
        setOpenMenuId(null)
    }

    const cancelRenaming = () => {
        setRenamingId(null)
        setTempTitle('')
    }

    const saveRename = async (id) => {
        if (!tempTitle.trim()) return toast.error('O título não pode ser vazio.')

        const resume = resumes.find(r => r.id === id)
        let finalTitle = tempTitle.trim()

        // Preserve Tags ([EN], [ES], [PTBR]) if missing in new title
        const tags = ['[EN]', '[ES]', '[PTBR]']
        const currentTag = tags.find(tag => resume?.title?.toUpperCase().includes(tag))
        const hasNewTag = tags.some(tag => finalTitle.toUpperCase().includes(tag))

        if (currentTag && !hasNewTag) {
            finalTitle = `${finalTitle} ${currentTag}`
        }

        try {
            const { error } = await supabase
                .from('resumes')
                .update({ title: finalTitle, updated_at: new Date() })
                .eq('id', id)

            if (error) throw error

            setResumes(prev => prev.map(r => r.id === id ? { ...r, title: finalTitle, updated_at: new Date() } : r))
            toast.success('Renomeado com sucesso!')
            setRenamingId(null)
        } catch (error) {
            console.error(error)
            toast.error('Erro ao renomear.')
        }
    }

    const [resumeToDelete, setResumeToDelete] = useState(null)

    const handleDelete = (id) => {
        setResumeToDelete(id)
    }

    const confirmDelete = async () => {
        if (!resumeToDelete) return

        try {
            const { error } = await supabase
                .from('resumes')
                .delete()
                .eq('id', resumeToDelete)

            if (error) throw error

            setResumes(prev => prev.filter(r => r.id !== resumeToDelete))
            toast.success('Currículo excluído com sucesso.')
            setResumeToDelete(null)
        } catch (error) {
            console.error('Error deleting resume:', error)
            toast.error('Erro ao excluir currículo.')
        }
    }

    const handleDuplicate = async (e, resume) => {
        e.stopPropagation()
        setOpenMenuId(null)

        if (!features.isPremium && resumes.length >= planLimit) {
            return toast.error('Limite do Plano Gratuito atingido!', {
                description: 'Você já alcançou o limite de currículos. Faça upgrade para duplicar.'
            })
        }

        const toastId = toast.loading('Duplicando currículo...')

        try {
            const { data, error } = await supabase
                .from('resumes')
                .insert({
                    user_id: user.id,
                    title: `${resume.title || 'Sem Título'} (Cópia)`,
                    content: resume.content,
                    strength: resume.strength,
                    updated_at: new Date()
                })
                .select()
                .single()

            if (error) throw error

            setResumes([data, ...resumes])
            toast.success('Currículo duplicado!', { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error('Erro ao duplicar.', { id: toastId })
        }
    }

    const handleTranslate = async (e, resume, targetLang) => {
        e.stopPropagation()
        setOpenMenuId(null)

        if (!features.isPremium) {
            return toast.error('Recurso Exclusivo!', {
                description: 'Tradução automática está disponível apenas para assinantes Premium.'
            })
        }

        if (resumes.length >= planLimit) {
            return toast.error('Limite Excedido!', {
                description: 'Apague ou arquive algum currículo para criar uma versão traduzida.'
            })
        }

        const langName = targetLang.startsWith('EN') ? 'Inglês' : 'Espanhol'
        const toastId = toast.loading(`Traduzindo para ${langName}...`)

        try {
            // 1. Translate content
            const translatedContent = await translateResume(resume.content, targetLang)

            // 2. Prepare title
            const baseTitle = resume.title || 'Meu Currículo'
            const displayLang = targetLang.startsWith('EN') ? 'EN' : targetLang
            const newTitle = `${baseTitle} [${displayLang}]`

            // 3. Save as new resume
            const { data, error } = await supabase
                .from('resumes')
                .insert({
                    user_id: user.id,
                    title: newTitle,
                    content: translatedContent,
                    strength: resume.strength,
                    updated_at: new Date()
                })
                .select()
                .single()

            if (error) throw error

            setResumes([data, ...resumes])
            toast.success(`Currículo traduzido para ${langName}!`, { id: toastId })

            // 4. Redirect to editor for review
            navigate(`/editor?id=${data.id}`)
        } catch (error) {
            console.error(error)
            toast.error('Erro ao traduzir currículo.', { id: toastId })
        }
    }


    useEffect(() => {
        if (user) {
            fetchResumes()
        }
    }, [user])

    const fetchResumes = async () => {
        try {
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .order('updated_at', { ascending: false })

            if (error) throw error
            setResumes(data || [])
        } catch (error) {
            console.error('Error fetching resumes:', error)
            toast.error('Erro ao carregar currículos.')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateBlank = async () => {
        setShowNewModal(false)
        const toastId = toast.loading('Criando novo currículo...')
        try {
            const initialContent = {
                personalInfo: { fullName: '', role: '', summary: '', locations: [], email: '', phone: '', linkedin: '', portfolio: '', github: '', youtube: '', nationality: '' },
                experience: [],
                education: [],
                skills: [],
                languages: []
            }
            const { data, error } = await supabase
                .from('resumes')
                .insert({ user_id: user.id, title: 'Meu Currículo', content: initialContent, strength: 0, updated_at: new Date() })
                .select()
                .single()
            if (error) throw error
            toast.success('Currículo criado!', { id: toastId })
            navigate(`/editor?id=${data.id}&new=1`)
        } catch (error) {
            console.error(error)
            toast.error('Erro ao criar currículo.', { id: toastId })
        }
    }

    const handleImportFile = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        e.target.value = ''

        setIsImporting(true)
        const toastId = toast.loading('Lendo currículo...')
        try {
            const parsed = await parseResume(file)

            const content = {
                personalInfo: {
                    fullName: '', role: '', email: '', phone: '',
                    linkedin: '', portfolio: '', github: '', youtube: '',
                    locations: [], nationality: '', summary: '',
                    ...parsed.personalInfo
                },
                experience: (parsed.experience || []).map((exp, i) => ({
                    id: Date.now() + i,
                    company: '', position: '', location: '',
                    startDate: '', endDate: '', isCurrent: false, description: '',
                    ...exp
                })),
                education: (parsed.education || []).map((edu, i) => ({
                    id: Date.now() + i + 100,
                    school: '', degree: '', field: '',
                    location: '', startDate: '', endDate: '', isCurrent: false,
                    ...edu
                })),
                skills: parsed.skills || [],
                languages: parsed.languages || []
            }

            const title = parsed.personalInfo?.fullName
                ? `Currículo de ${parsed.personalInfo.fullName}`
                : 'Currículo Importado'

            const { data, error } = await supabase
                .from('resumes')
                .insert({ user_id: user.id, title, content, strength: 0, updated_at: new Date() })
                .select()
                .single()
            if (error) throw error

            toast.success('Currículo importado!', { id: toastId })
            setShowNewModal(false)
            navigate(`/editor?id=${data.id}&new=1`)
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Erro ao importar currículo.', { id: toastId })
        } finally {
            setIsImporting(false)
        }
    }


    return (
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 h-screen flex flex-row overflow-hidden pb-24 md:pb-0">
            {/* Shared Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Subtle Background "UAU" effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/10 rounded-full blur-[100px]" />
                </div>



                <Header
                    title="Meus Currículos"
                    subtitle="Gerencie suas versões e crie novos documentos."
                    planCurrent={resumes.length}
                    isPremium={features.isPremium}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-10 z-10">
                    <div className="max-w-5xl mx-auto">
                        {/* Mobile Plan Widget (Visible only on mobile) */}
                        <div className="md:hidden mb-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Seu Plano</span>
                                <PlanWidget current={resumes.length} max={2} isPremium={features.isPremium} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">

                                {/* Create New Card */}
                                <NewResumeCard
                                    onClick={() => setShowNewModal(true)}
                                    disabled={isAtLimit}
                                    onUpgradeClick={() => navigate('/upgrade')}
                                />

                                {/* Resume Cards */}
                                {resumes.map((resume, index) => {
                                    const isLocked = !features.isPremium && index >= planLimit

                                    return (
                                        <ResumeCard
                                            key={resume.id}
                                            resume={resume}
                                            isLocked={isLocked}
                                            openMenuId={openMenuId}
                                            onMenuClick={handleMenuClick}
                                            renamingId={renamingId}
                                            tempTitle={tempTitle}
                                            setTempTitle={setTempTitle}
                                            onStartRenaming={startRenaming}
                                            onCancelRenaming={cancelRenaming}
                                            onSaveRename={saveRename}
                                            onDuplicate={handleDuplicate}
                                            onDownload={handleDownload}
                                            onTranslate={handleTranslate}
                                            onDelete={handleDelete}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </main>

                {/* Hidden file input for import */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleImportFile}
                />

                {/* New Resume Modal */}
                {showNewModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowNewModal(false)}>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Novo Currículo</h3>
                                    <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {/* Blank */}
                                    <button
                                        onClick={handleCreateBlank}
                                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-primary hover:bg-primary-light transition-all group text-left"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                            <FileText size={22} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm">Criar em branco</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Comece do zero e preencha seus dados</p>
                                        </div>
                                    </button>

                                    {/* Import */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isImporting}
                                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-primary hover:bg-primary-light transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                            {isImporting ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm">Importar currículo</p>
                                            <p className="text-xs text-slate-500 mt-0.5">PDF, DOCX ou TXT — preenchemos para você</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Delete Modal */}
                {resumeToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setResumeToDelete(null)}>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                            <div className="p-6 text-center">
                                <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-red-600">
                                    <Trash2 size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Excluir Currículo?</h3>
                                <p className="text-sm text-slate-500 mb-6">Esta ação é irreversível. O currículo será apagado permanentemente.</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setResumeToDelete(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                                    >
                                        Sim, Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
