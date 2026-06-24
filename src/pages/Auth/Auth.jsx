import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import { toast } from 'sonner'
import { Hexagon, Loader2, Eye, EyeOff } from 'lucide-react'

const Auth = ({ defaultMode = 'register' }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [mode, setMode] = useState(defaultMode)
    
    // Form States
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // Sync mode with route query parameter if available
    useEffect(() => {
        const queryMode = searchParams.get('mode')
        if (queryMode === 'login' || queryMode === 'register') {
            setMode(queryMode)
        } else {
            setMode(defaultMode)
        }
    }, [defaultMode, searchParams])

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (mode === 'register') {
                if (!fullName.trim()) {
                    throw new Error('Por favor, digite seu nome completo.')
                }
                if (password.length < 6) {
                    throw new Error('A senha deve ter pelo menos 6 caracteres.')
                }
                if (password !== confirmPassword) {
                    throw new Error('As senhas não coincidem.')
                }
                if (!acceptedTerms) {
                    throw new Error('Você precisa aceitar os termos de uso.')
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                })
                if (error) throw error
                toast.success('Conta criada com sucesso!')
                navigate('/dashboard')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) throw error
                toast.success('Login realizado com sucesso!')
                navigate('/dashboard')
            }
        } catch (error) {
            console.error(error)
            toast.error(mode === 'register' ? 'Erro ao criar conta' : 'Erro ao entrar', {
                description: error.message === 'Invalid login credentials'
                    ? 'E-mail ou senha incorretos.'
                    : error.message
            })
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 relative">
                <div className="absolute top-4 left-4">
                    <Link to="/" className="text-slate-500 hover:text-[var(--primary)] text-sm font-bold flex items-center gap-2">
                        ← Voltar
                    </Link>
                </div>
                
                <div className="flex flex-col items-center mb-6 mt-4">
                    <div className="bg-[var(--primary)] p-3 rounded-xl mb-4 shadow-lg shadow-orange-200 dark:shadow-none">
                        <Hexagon size={32} className="text-white fill-current" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {mode === 'register' ? 'Cadastre-se' : 'Entrar'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm text-center">
                        {mode === 'register' 
                            ? 'Crie sua conta para construir seu currículo profissional' 
                            : 'Acesse sua conta para continuar gerenciando seus currículos'}
                    </p>
                </div>



                {/* E-mail Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="Seu Nome"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all dark:text-white"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                            {mode === 'login' && (
                                <Link to="/forgot-password" className="text-xs text-[var(--primary)] hover:underline">Esqueceu?</Link>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all pr-10 dark:text-white"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {mode === 'register' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar Senha</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                                    Concordo com os <Link to="/terms" className="text-[var(--primary)] hover:underline font-semibold">termos de uso</Link>
                                </label>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-orange-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : mode === 'register' ? 'Criar Conta' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    {mode === 'register' ? (
                        <>
                            Já tem uma conta?{' '}
                            <button
                                type="button"
                                onClick={() => setSearchParams({ mode: 'login' })}
                                className="text-[var(--primary)] font-bold hover:underline"
                            >
                                Entrar
                            </button>
                        </>
                    ) : (
                        <>
                            Não tem uma conta?{' '}
                            <button
                                type="button"
                                onClick={() => setSearchParams({ mode: 'register' })}
                                className="text-[var(--primary)] font-bold hover:underline"
                            >
                                Cadastre-se
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Auth
