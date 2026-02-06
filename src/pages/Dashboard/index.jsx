
import React, { useState } from 'react'
import {
    ChevronDown, PlusCircle, MoreVertical, Edit2, Trash2, Clock, CheckCircle
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../../components/Sidebar'
import UserDropdown from '../../components/UserDropdown'
import PlanWidget from '../../components/PlanWidget'

const Dashboard = () => {
    const navigate = useNavigate()

    // Mock Data
    const [resumes, setResumes] = useState([
        { id: 1, title: 'Front-End Developer', updatedAt: '05/02/2026', strength: 85, thumbnail: 'https://ui-avatars.com/api/?name=FE&background=0ea5e9&color=fff' },
        { id: 2, title: 'Product Designer', updatedAt: '20/01/2026', strength: 60, thumbnail: 'https://ui-avatars.com/api/?name=PD&background=6366f1&color=fff' }
    ])

    const planLimit = 2

    const handleCreateNew = () => {
        if (resumes.length >= planLimit) {
            toast.error('Limite do Plano Gratuito atingido!', {
                description: 'Você já possui 2 currículos criados. Faça upgrade para criar ilimitados.'
            })
            return
        }
        navigate('/editor')
    }

    return (
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 h-screen flex flex-row overflow-hidden pb-16 md:pb-0">
            {/* Shared Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Subtle Background "UAU" effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/10 rounded-full blur-[100px]" />
                </div>

                {/* Header - Similar to Editor but Simplified */}
                <header className="flex items-center justify-between bg-white/80 backdrop-blur-md dark:bg-slate-900/80 px-4 md:px-8 h-16 md:h-20 border-b border-slate-200 dark:border-slate-800 shrink-0 z-10 relative">
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-none">Meus Currículos</h1>
                        <p className="text-[10px] md:text-xs text-slate-500 hidden md:block">Gerencie suas versões e crie novos documentos.</p>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Plan Widget Mini */}
                        <div className="hidden md:block">
                            <PlanWidget current={resumes.length} max={2} />
                        </div>

                        <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>

                        <UserDropdown />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-10 z-10">
                    <div className="max-w-6xl mx-auto">
                        {/* Mobile Plan Widget (Visible only on mobile) */}
                        <div className="md:hidden mb-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Seu Plano</span>
                                <PlanWidget current={resumes.length} max={2} />
                            </div>
                        </div>

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
                            {resumes.map(resume => (
                                <div key={resume.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-[280px] md:h-[320px]">
                                    {/* Preview Area (Top 60%) */}
                                    <div className="h-[55%] md:h-[60%] bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-start justify-center pt-6 group-hover:bg-slate-100/50 transition-colors">
                                        <div className="w-[85%] md:w-[80%] h-full bg-white shadow-lg rounded-t-sm origin-top mx-auto pointer-events-none transform group-hover:scale-105 transition-transform duration-500 border-t border-x border-slate-200/50">
                                            <div className="h-3 w-full bg-blue-600/10 mb-2"></div>
                                            <div className="space-y-2 p-2">
                                                <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                                <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                        {/* Actions Overlay */}
                                        <div className="absolute top-3 right-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="flex-1 p-4 md:p-5 flex flex-col justify-between relative bg-white dark:bg-slate-900 z-10">
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1 truncate" title={resume.title}>{resume.title}</h3>
                                            <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 mb-3">
                                                <Clock size={12} />
                                                <span>Atualizado em {resume.updatedAt}</span>
                                            </div>

                                            {/* Strength Meter Mini */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${resume.strength}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-600">{resume.strength}%</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                            <Link to="/editor" className="flex-1 h-8 md:h-9 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                                <Edit2 size={14} /> Editar
                                            </Link>
                                            <button className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
