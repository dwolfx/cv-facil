
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, User, Lock, LogOut, CreditCard } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'

const UserDropdown = () => {
    const { user, signOut } = useAuth()

    // Fallback if not loaded yet
    const name = user?.user_metadata?.full_name || 'Usuário'
    const email = user?.email || ''
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${isOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
                <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-700">{name}</span>
                    <span className="text-[10px] text-slate-400">{email}</span>
                </div>
                <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-[var(--primary)] font-bold text-sm border border-orange-200">
                    {initials}
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                        <Link
                            to="/settings?tab=profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-[var(--primary)] rounded-lg transition-colors font-medium"
                        >
                            <User size={16} /> Meus Dados
                        </Link>
                        <Link
                            to="/settings?tab=account"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-[var(--primary)] rounded-lg transition-colors font-medium"
                        >
                            <Lock size={16} /> Alterar Senha
                        </Link>
                        <Link
                            to="/settings?tab=subscription"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-[var(--primary)] rounded-lg transition-colors font-medium"
                        >
                            <CreditCard size={16} /> Assinatura
                        </Link>
                    </div>
                    <div className="border-t border-slate-100 p-2 bg-slate-50/50">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold"
                        >
                            <LogOut size={16} /> Sair da Conta
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDropdown
