

import React, { useState, useEffect } from 'react'
import {
    ChevronDown, PlusCircle, MoreVertical, Edit2, Trash2, Clock, CheckCircle, Loader2, Download, Lock
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../../components/Sidebar'
import UserDropdown from '../../components/UserDropdown'
import PlanWidget from '../../components/PlanWidget'
import Header from '../../components/Header'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { useUserPlan } from '../../hooks/useUserPlan'
import { generateResumePDF } from '../../utils/pdfGenerator'

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
                async () => generateResumePDF(resume.content),
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

        try {
            const { error } = await supabase
                .from('resumes')
                .update({ title: tempTitle, updated_at: new Date() })
                .eq('id', id)

            if (error) throw error

            setResumes(prev => prev.map(r => r.id === id ? { ...r, title: tempTitle, updated_at: new Date() } : r))
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

    // Format Date Helper
    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('pt-BR')
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
                                <button
                                    onClick={handleCreateNew}
                                    className="group flex flex-col items-center justify-center h-[280px] md:h-[320px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-[var(--primary)] hover:bg-orange-50/50 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="size-14 md:size-16 rounded-full bg-orange-100 text-[var(--primary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <PlusCircle size={28} />
                                    </div>
                                    <h3 className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-[var(--primary)] transition-colors">Criar Novo Currículo</h3>
                                    <p className="text-xs text-slate-400 mt-2">Começar do zero ou importar</p>
                                </button>

                                {/* Resume Cards */}
                                {resumes.map((resume, index) => {
                                    const isLocked = !features.isPremium && index >= planLimit

                                    return (
                                        <div key={resume.id} className={`bg-white dark:bg-slate-900 border ${isLocked ? 'border-slate-200 dark:border-slate-800 opacity-75' : 'border-slate-200 dark:border-slate-800'} rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-[280px] md:h-[320px] relative`}>

                                            {/* Locked Overlay on Preview */}
                                            {isLocked && (
                                                <div className="absolute top-3 left-3 z-30">
                                                    <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                                        <Lock size={10} /> Bloqueado
                                                    </div>
                                                </div>
                                            )}

                                            {/* Preview Area (Top 60%) */}
                                            <div className={`h-[55%] md:h-[60%] bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-start justify-center pt-6 ${!isLocked && 'group-hover:bg-slate-100/50'} transition-colors`}>
                                                <div className={`w-[85%] md:w-[80%] h-full bg-white shadow-lg rounded-t-sm origin-top mx-auto pointer-events-none transform ${!isLocked && 'group-hover:scale-105'} transition-transform duration-500 border-t border-x border-slate-200/50 flex flex-col p-4 overflow-hidden relative ${isLocked && 'grayscale opacity-75'}`}>
                                                    {/* Paper Texture / Content */}
                                                    {resume.content?.personalInfo?.fullName ? (
                                                        <div className="flex flex-col gap-2">
                                                            {/* User Name */}
                                                            <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-100 pb-1 mb-1">
                                                                {resume.content.personalInfo.fullName}
                                                            </div>

                                                            {/* User Role */}
                                                            {resume.content.personalInfo.role && (
                                                                <div className="text-[8px] font-semibold text-blue-600 uppercase mb-1">
                                                                    {resume.content.personalInfo.role}
                                                                </div>
                                                            )}

                                                            {/* Fake Content Lines (Skeleton based on Real Data presence) */}
                                                            <div className="space-y-1.5 opacity-60">
                                                                {/* Summary or lines */}
                                                                <div className="h-1 bg-slate-200 rounded-full w-full"></div>
                                                                <div className="h-1 bg-slate-100 rounded-full w-5/6"></div>
                                                                <div className="h-1 bg-slate-100 rounded-full w-4/6"></div>

                                                                {/* Gap */}
                                                                <div className="h-2"></div>

                                                                {/* Experience Mockup */}
                                                                <div className="h-1.5 bg-slate-200 rounded-full w-1/3 mb-1"></div>
                                                                <div className="h-1 bg-slate-100 rounded-full w-full"></div>
                                                                <div className="h-1 bg-slate-100 rounded-full w-3/4"></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* Empty/Skeleton State */}
                                                            <div className="h-3 w-full bg-blue-600/10 mb-2 rounded-sm"></div>
                                                            <div className="space-y-2 p-1">
                                                                <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                                                <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Fade Out Effect at Bottom */}
                                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                                </div>

                                                {/* Actions Overlay / Dropdown - Hide if Locked */}
                                                {!isLocked && (
                                                    <div className="absolute top-3 right-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => handleMenuClick(e, resume.id)}
                                                                className="p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>

                                                            {openMenuId === resume.id && (
                                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 z-50 flex flex-col">
                                                                    <Link
                                                                        to={`/editor?id=${resume.id}`}
                                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
                                                                    >
                                                                        <Edit2 size={14} /> Editar
                                                                    </Link>
                                                                    <button
                                                                        onClick={(e) => startRenaming(e, resume)}
                                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                                    >
                                                                        <Edit2 size={14} className="opacity-0" />
                                                                        Renomear
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleDelete(resume.id); }}
                                                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"
                                                                    >
                                                                        <Trash2 size={14} /> Excluir
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Area */}
                                            <div className="flex-1 p-4 md:p-5 flex flex-col justify-between relative bg-white dark:bg-slate-900 z-10">
                                                <div>
                                                    {renamingId === resume.id ? (
                                                        <div className="mb-1 flex items-center gap-1">
                                                            <input
                                                                type="text"
                                                                value={tempTitle}
                                                                onChange={(e) => setTempTitle(e.target.value)}
                                                                className="w-full text-sm font-bold border rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                autoFocus
                                                                onKeyDown={(e) => e.key === 'Enter' && saveRename(resume.id)}
                                                            />
                                                            <button onClick={() => saveRename(resume.id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><CheckCircle size={14} /></button>
                                                            <button onClick={cancelRenaming} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14} /></button>
                                                        </div>
                                                    ) : (
                                                        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1 truncate" title={resume.title}>{resume.title || 'Sem Título'}</h3>
                                                    )}
                                                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 mb-3">
                                                        <Clock size={12} />
                                                        <span>Atualizado em {formatDate(resume.updated_at)}</span>
                                                    </div>

                                                    {/* Strength Meter Mini */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${resume.strength || 0}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-emerald-600">{resume.strength || 0}%</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 relative z-20">
                                                    {/* Edit Button - Disabled if Locked */}
                                                    {isLocked ? (
                                                        <button
                                                            onClick={() => toast.error('Limite excedido.', { description: 'Faça upgrade para editar este currículo.' })}
                                                            className="flex-1 h-8 md:h-9 flex items-center justify-center gap-2 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed uppercase tracking-wider"
                                                        >
                                                            <Lock size={14} /> Bloqueado
                                                        </button>
                                                    ) : (
                                                        <Link to={`/editor?id=${resume.id}`} className="flex-1 h-8 md:h-9 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                                            <Edit2 size={14} /> Editar
                                                        </Link>
                                                    )}

                                                    {/* Download Button - Always enabled */}
                                                    <button
                                                        onClick={() => handleDownload(resume)}
                                                        className="h-8 md:h-9 flex items-center justify-center px-3 gap-2 bg-orange-50 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 hover:border-orange-300 shadow-sm font-bold pointer-events-auto"
                                                        title="Baixar PDF"
                                                    >
                                                        <Download size={14} />
                                                        <span className="text-[10px] hidden xl:inline">PDF</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(resume.id)}
                                                        className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 pointer-events-auto"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </main>

                {/* Custom Delete Modal */}
                {resumeToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
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
