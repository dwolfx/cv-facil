
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, FileText, UploadCloud, Settings } from 'lucide-react'

const Sidebar = () => {
    const location = useLocation()
    const currentPath = location.pathname

    const isActive = (path) => currentPath.startsWith(path)

    return (
        <nav className="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-6 z-20 shrink-0 h-full">
            {/* Main Logo/Dashboard Link */}
            <Link to="/dashboard" className={`p-2 rounded-lg mb-2 shadow-lg transition-colors ${isActive('/dashboard') ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-100'}`}>
                <Layout size={20} />
            </Link>

            <div className="flex flex-col gap-4 w-full">
                {/* 1. Dashboard Link (Already top, but user asked for Menu items order) 
                   User said: 1st button -> Dashboard, 2nd -> Editor, 3rd -> Nothing (Em breve)
                   The top logo IS usually the dashboard/home, but I will put the specific nav items here.
                */}

                {/* 1. Dashboard (Layout Icon) */}
                <Link to="/dashboard" className={`h-10 w-full flex items-center justify-center transition-colors relative group ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
                    <Layout size={20} />
                    <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Dashboard</span>
                </Link>

                {/* 2. Editor (FileText Icon) */}
                <Link to="/editor" className={`h-10 w-full flex items-center justify-center transition-colors relative group ${isActive('/editor') ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
                    <FileText size={20} />
                    <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Novo Currículo</span>
                </Link>

                {/* 3. Upload/Import (UploadCloud Icon - DISABLED) */}
                <div className="h-10 w-full flex items-center justify-center text-slate-300 cursor-not-allowed relative group">
                    <UploadCloud size={20} />
                    <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Em breve</span>
                </div>
            </div>

            <div className="mt-auto flex flex-col gap-4">
                <button className="h-10 w-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors relative group">
                    <Settings size={20} />
                    <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Configurações</span>
                </button>
                <div className="size-8 rounded-full bg-slate-200 overflow-hidden mx-auto border border-slate-300">
                    <img src="https://ui-avatars.com/api/?name=Ricardo+Silva&background=random" alt="User" />
                </div>
            </div>
        </nav>
    )
}

export default Sidebar
