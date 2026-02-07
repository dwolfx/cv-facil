
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import { toast } from 'sonner'
import { Hexagon, Loader2, Eye, EyeOff } from 'lucide-react'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            toast.success('Login realizado com sucesso!')
            navigate('/dashboard')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao fazer login', {
                description: error.message === 'Invalid login credentials'
                    ? 'E-mail ou senha incorretos.'
                    : 'Ocorreu um erro ao tentar entrar. Tente novamente.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="absolute top-4 left-4">
                    <Link to="/" className="text-slate-500 hover:text-[var(--primary)] text-sm font-bold flex items-center gap-2">
                        ← Voltar
                    </Link>
                </div>
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[var(--primary)] p-3 rounded-xl mb-4 shadow-lg shadow-orange-200">
                        <Hexagon size={32} className="text-white fill-current" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bem-vindo de volta!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Acesse sua conta para continuar.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                            <Link to="/forgot-password" className="text-xs text-[var(--primary)] hover:underline">Esqueceu?</Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all pr-10"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="text-[var(--primary)] font-bold hover:underline">
                        Crie agora
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
