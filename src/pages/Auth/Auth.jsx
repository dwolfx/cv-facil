import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import { toast } from 'sonner'
import { Hexagon, Loader2, Eye, EyeOff, MessageSquare } from 'lucide-react'

// Brand-approved colored SVGs for social providers
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
)

const AppleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5 fill-current text-slate-900 dark:text-white">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
    </svg>
)

const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5">
        <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
)

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5">
        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
)

const Auth = ({ defaultMode = 'register' }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [mode, setMode] = useState(defaultMode)
    
    // Form States
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // Sync mode with route if needed, but default to register for both as requested
    useEffect(() => {
        // We set to register by default as requested. If they explicitly click the link below, the state changes locally.
        setMode(defaultMode)
    }, [defaultMode, location.pathname])

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

    const handleSocialLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            })
            if (error) throw error
        } catch (error) {
            console.error(error)
            toast.error(`Erro ao autenticar com ${provider === 'linkedin_oidc' ? 'LinkedIn' : provider}`, {
                description: 'Verifique se o provedor está ativado no console do Supabase. ' + error.message
            })
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

                {/* Social Login Buttons */}
                <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 text-center uppercase tracking-wider mb-3">
                        Entrar com rede social
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            title="Entrar com Google"
                            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
                        >
                            <GoogleIcon />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('apple')}
                            title="Entrar com Apple"
                            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
                        >
                            <AppleIcon />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('linkedin_oidc')}
                            title="Entrar com LinkedIn"
                            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
                        >
                            <LinkedinIcon />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            title="Entrar com Facebook"
                            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
                        >
                            <FacebookIcon />
                        </button>
                    </div>

                    <div className="relative my-6 flex py-1 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">ou use seu e-mail</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
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
                                onClick={() => setMode('login')}
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
                                onClick={() => setMode('register')}
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
