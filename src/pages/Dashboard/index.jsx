
import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
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

    const handleCreateNew = async () => {
        if (resumes.length >= planLimit) {
            toast.error('Limite do Plano Gratuito atingido!', {
                description: 'Você já possui 2 currículos criados. Faça upgrade para criar ilimitados.'
            })
            return
        }

        const toastId = toast.loading('Criando novo currículo...')

        try {
            // Minimal initial content
            const initialContent = {
                personalInfo: { fullName: '', role: '', summary: '', locations: [], email: '', phone: '', linkedin: '', portfolio: '' },
                experience: [],
                education: [],
                skills: [],
                languages: []
            }

            const { data, error } = await supabase
                .from('resumes')
                .insert({
                    user_id: user.id,
                    title: 'Meu Currículo',
                    content: initialContent,
                    strength: 0,
                    updated_at: new Date()
                })
                .select()
                .single()

            if (error) throw error

            toast.success('Currículo criado!', { id: toastId })
            navigate(`/editor?id=${data.id}`)
        } catch (error) {
            console.error(error)
            toast.error('Erro ao criar currículo.', { id: toastId })
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
                                <NewResumeCard onClick={handleCreateNew} />

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
