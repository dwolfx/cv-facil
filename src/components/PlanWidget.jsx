
import React from 'react'
import { Link } from 'react-router-dom'

const PlanWidget = ({ current = 1, max = 2, className = '' }) => {
    return (
        <Link to="/upgrade" className={`flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-orange-100 dark:border-orange-800 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors ${className}`}>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[var(--primary)] dark:text-orange-300 uppercase">Plano Gratuito</span>
                <span className="text-[10px] text-[var(--primary)] dark:text-orange-300">{current} de {max} usados</span>
            </div>
            <div className="w-16 h-1.5 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: `${(current / max) * 100}%` }}></div>
            </div>
        </Link>
    )
}

export default PlanWidget
