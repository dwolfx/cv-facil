import React, { useEffect, useState } from 'react'

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const MonthYearPicker = ({ value, onChange, disabled, className }) => {
    // Value format: "YYYY-MM" (ISO) preferred. 
    // If incoming is "MM/YYYY" (legacy), we parse it.

    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    useEffect(() => {
        if (!value) {
            setMonth('')
            setYear('')
            return
        }

        if (value.includes('-')) {
            const [y, m] = value.split('-')
            setMonth(m)
            setYear(y)
        } else if (value.includes('/')) {
            const [m, y] = value.split('/')
            setMonth(m)
            setYear(y)
        }
    }, [value])

    const updateDate = (m, y) => {
        if (m && y) {
            onChange(`${y}-${m}`) // Save as ISO YYYY-MM
        } else if (!m && !y) {
            onChange('')
        }
        // If partial, don't onChange yet? Or save partial? 
        // Better to wait for both or save partial if supported. 
        // Let's only save if both present.
    }

    const handleMonthChange = (e) => {
        const newMonth = e.target.value
        setMonth(newMonth)
        updateDate(newMonth, year)
    }

    const handleYearChange = (e) => {
        const newYear = e.target.value
        setYear(newYear)
        updateDate(month, newYear)
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 60 }, (_, i) => currentYear + 5 - i)

    return (
        <div className={`flex gap-2 ${className}`}>
            <select
                value={month}
                onChange={handleMonthChange}
                disabled={disabled}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:bg-gray-100 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all cursor-pointer"
            >
                <option value="">Mês</option>
                {months.map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                ))}
            </select>
            <select
                value={year}
                onChange={handleYearChange}
                disabled={disabled}
                className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:bg-gray-100 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all cursor-pointer"
            >
                <option value="">Ano</option>
                {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
    )
}

export default MonthYearPicker
