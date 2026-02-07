
import React from 'react'
import { Link } from 'react-router-dom'

const PlanWidget = ({ current = 0, max = 2, isPremium = false, className = '' }) => {

    // Determine Color Scheme based on usage or premium status
    const getTheme = () => {
        if (isPremium) {
            return {
                wrapper: "bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800",
                textParams: "text-purple-700 dark:text-purple-300",
                barBg: "bg-purple-200 dark:bg-purple-800",
                barFill: "bg-purple-600 dark:bg-purple-400",
                label: "PLANO PRO 🚀",
                subLabel: "Ilimitado"
            }
        }

        // Free Plan Logic
        if (current === 0) {
            return {
                wrapper: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800",
                textParams: "text-emerald-700 dark:text-emerald-300",
                barBg: "bg-emerald-200 dark:bg-emerald-800",
                barFill: "bg-emerald-500 dark:bg-emerald-400",
                label: "PLANO GRATUITO",
                subLabel: `${current} de ${max} usados`
            }
        }

        if (current === 1) {
            return {
                wrapper: "bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800",
                textParams: "text-orange-700 dark:text-orange-300",
                barBg: "bg-orange-200 dark:bg-orange-800",
                barFill: "bg-orange-500 dark:bg-orange-400",
                label: "PLANO GRATUITO",
                subLabel: `${current} de ${max} usados`
            }
        }

        // Full / Red
        return {
            wrapper: "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800",
            textParams: "text-red-700 dark:text-red-300",
            barBg: "bg-red-200 dark:bg-red-800",
            barFill: "bg-red-500 dark:bg-red-400",
            label: "PLANO GRATUITO",
            subLabel: `${current} de ${max} usados`
        }
    }

    const theme = getTheme()

    const percentage = isPremium ? 100 : Math.min((current / max) * 100, 100)

    return (
        <Link
            to={isPremium ? "/settings?tab=subscription" : "/upgrade"}
            className={`flex items-center justify-between gap-4 px-4 py-2 rounded-full border shadow-sm hover:opacity-90 transition-opacity ${theme.wrapper} ${className}`}
        >
            <div className="flex flex-col items-start gap-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.textParams}`}>
                    {theme.label}
                </span>
                <span className={`text-[10px] opacity-80 font-medium ${theme.textParams}`}>
                    {theme.subLabel}
                </span>
            </div>

            {/* Progress Bar */}
            <div className={`w-16 h-1.5 rounded-full overflow-hidden ${theme.barBg}`}>
                <div
                    className={`h-full rounded-full transition-all duration-500 ${theme.barFill}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </Link>
    )
}

export default PlanWidget
