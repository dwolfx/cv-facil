import React from 'react'
import PlanWidget from './PlanWidget'
import UserDropdown from './UserDropdown'

const Header = ({ title, subtitle, children, className = '', planCurrent = 1, planMax = 2 }) => {
    return (
        <header className={`flex items-center justify-between bg-white/80 backdrop-blur-md dark:bg-slate-900/80 px-4 md:px-8 h-16 md:h-20 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20 relative transition-all duration-300 ${className}`}>
            <div className="flex flex-col justify-center">
                <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-none">{title}</h1>
                {subtitle && (
                    <p className="text-[10px] md:text-xs text-slate-500 hidden md:block mt-1">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Custom Children (e.g. Action Buttons) */}
                {children}

                {/* Divider if children exist */}
                {children && <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>}

                {/* Plan Widget - Flexible visibility */}
                <div className="hidden md:block">
                    <PlanWidget current={planCurrent} max={planMax} />
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

                <UserDropdown />
            </div>
        </header>
    )
}

export default Header
