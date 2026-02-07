
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, FileText, UploadCloud, Settings, Hexagon } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
    const { user } = useAuth()
    const userName = user?.user_metadata?.full_name || 'User'
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`

    const location = useLocation()
    const currentPath = location.pathname

    const isActive = (path) => currentPath.startsWith(path)

    return (
        <>
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <nav className="hidden md:flex w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col items-center py-6 gap-6 z-20 shrink-0 h-full">
                {/* Main Logo/Dashboard Link */}
                <Link to="/dashboard" className="p-2 rounded-lg mb-2 shadow-lg transition-colors bg-[var(--primary)] text-white hover:opacity-90">
                    <Hexagon size={24} fill="currentColor" />
                </Link>

                <div className="flex flex-col gap-4 w-full">
                    <Link to="/dashboard" className={`h-10 w-full flex items-center justify-center transition-colors relative group ${isActive('/dashboard') ? 'text-[var(--primary)] bg-orange-50 border-r-2 border-[var(--primary)]' : 'text-slate-400 hover:text-[var(--primary)]'}`}>
                        <Layout size={20} />
                        <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Dashboard</span>
                    </Link>

                    <Link to="/editor" className={`h-10 w-full flex items-center justify-center transition-colors relative group ${isActive('/editor') ? 'text-[var(--primary)] bg-orange-50 border-r-2 border-[var(--primary)]' : 'text-slate-400 hover:text-[var(--primary)]'}`}>
                        <FileText size={20} />
                        <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Novo Currículo</span>
                    </Link>

                    <div className="h-10 w-full flex items-center justify-center text-slate-300 cursor-not-allowed relative group">
                        <UploadCloud size={20} />
                        <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Em breve</span>
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-4 w-full">
                    <Link to="/settings" className={`h-10 w-full flex items-center justify-center transition-colors relative group ${isActive('/settings') ? 'text-[var(--primary)] bg-orange-50 border-r-2 border-[var(--primary)]' : 'text-slate-400 hover:text-[var(--primary)]'}`}>
                        <Settings size={20} />
                        <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Configurações</span>
                    </Link>
                    <div className="size-8 rounded-full bg-slate-200 overflow-hidden mx-auto border border-slate-300">
                        <img src={avatarUrl} alt={userName} />
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation (Visible only on Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 h-16 flex items-center justify-around px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                    <Layout size={20} />
                    <span className="text-[10px] font-bold">Início</span>
                </Link>

                <Link to="/editor" className="relative -top-5 bg-[var(--primary)] text-white p-3.5 rounded-full shadow-lg shadow-orange-200 flex items-center justify-center border-4 border-slate-50 dark:border-slate-950">
                    <FileText size={24} />
                </Link>

                <Link to="/settings" className={`flex flex-col items-center gap-1 ${isActive('/settings') ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                    <Settings size={20} />
                    <span className="text-[10px] font-bold">Config</span>
                </Link>
            </nav>
        </>
    )
}

export default Sidebar
