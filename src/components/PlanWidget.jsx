
import React from 'react'
import { Link } from 'react-router-dom'

const PlanWidget = ({ current = 0, max = 2, isPremium = false, className = '' }) => {
    // Free Plan Logic
    const getFreeColor = () => {
        if (current === 0) return 'text-emerald-500'
        if (current === 1) return 'text-orange-500'
        return 'text-red-500'
    }

    const getFreeBarColor = () => {
        if (current === 0) return 'bg-emerald-500'
        if (current === 1) return 'bg-orange-500'
        return 'bg-red-500'
    }

    if (isPremium) {
        return (
            <Link to="/settings?tab=subscription" className={`flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-800 px-4 py-2 rounded-full border border-orange-200 dark:border-slate-700 cursor-pointer shadow-sm hover:shadow-md transition-all ${className}`}>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Plano PRO 🚀</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{current} Currículos criados</span>
                </div>
            </Link>
        )
    }

    // Free Plan
    return (
        <Link to="/upgrade" className={`flex items-center gap-3 bg-white dark:bg-slate-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${className}`}>
            <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold uppercase ${getFreeColor()}`}>Plano Gratuito</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{current} de {max} usados</span>
            </div>
            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${getFreeBarColor()}`} style={{ width: `${(current / max) * 100}%` }}></div>
            </div>
        </Link>
    )
}

export default PlanWidget
