
import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { User, Lock, CreditCard, Save, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Sidebar from '../../components/Sidebar'
import UserDropdown from '../../components/UserDropdown'
import PlanWidget from '../../components/PlanWidget'
import Header from '../../components/Header'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'

const Settings = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
    const [userData, setUserData] = useState({
        full_name: '',
        email: '',
        phone: ''
    })

    useEffect(() => {
        if (user) {
            fetchProfile()
            setUserData(prev => ({ ...prev, email: user.email }))
        }
    }, [user])

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error
            if (data) {
                setUserData(prev => ({
                    ...prev,
                    full_name: data.full_name || '',
                    plan_tier: data.plan_tier
                }))
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
            // Don't toast error here to avoid annoying popups if profile is missing (trigger should handle creation though)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        setUpdating(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: userData.full_name,
                    updated_at: new Date()
                })

            if (error) throw error
            toast.success('Perfil atualizado com sucesso!')

            // Optionally update auth metadata if needed
            // await supabase.auth.updateUser({ data: { full_name: userData.full_name } })

        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Erro ao atualizar perfil.')
        } finally {
            setUpdating(false)
        }
    }


    const handleUpdatePassword = async () => {
        const currentPassword = document.getElementById('current-password')?.value

        if (!currentPassword) return toast.error('Digite a senha atual.')
        if (!newPassword || newPassword.length < 6) return toast.error('A nova senha deve ter pelo menos 6 caracteres.')
        if (newPassword !== confirmNewPassword) return toast.error('As senhas não coincidem.')

        setUpdating(true)
        try {
            // 1. Verify current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword
            })

            if (signInError) throw new Error('Senha atual incorreta.')

            // 2. Update to new password
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error

            toast.success('Senha atualizada com sucesso!')
            document.getElementById('current-password').value = ''
            setNewPassword('')
            setConfirmNewPassword('')

        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Erro ao atualizar senha.')
        } finally {
            setUpdating(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Tem certeza ABSOLUTA? Esta ação exclui permanentemente sua conta e todos os dados.')) return

        setUpdating(true)
        try {
            // Call Database Function (RPC) to delete everything
            const { error } = await supabase.rpc('delete_own_user')

            if (error) {
                console.error('RPC Error:', error)
                throw new Error('Erro ao excluir conta: ' + error.message)
            }

            // Sign out locally
            await supabase.auth.signOut()
            navigate('/login')
            toast.success('Conta excluída definitivamente.')

        } catch (error) {
            console.error('Account deletion error:', error)
            toast.error(error.message)
        } finally {
            setUpdating(false)
        }
    }

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--primary)]" /></div>
        }

        switch (activeTab) {
            case 'profile':
                return (
                    <div className="max-w-xl space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Dados Pessoais</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        value={userData.full_name}
                                        onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        disabled
                                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                                        value={userData.email}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">O e-mail não pode ser alterado.</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={updating}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-200 disabled:opacity-70"
                                >
                                    {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                )
            case 'account':
                return (
                    <div className="max-w-xl space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Alterar Senha</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha Atual</label>
                                    <input
                                        type="password"
                                        id="current-password"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                                        placeholder="Digite sua senha atual"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nova Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg pr-10"
                                            placeholder="Nova senha"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirmar Nova Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmNewPassword ? 'text' : 'password'}
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg pr-10"
                                            placeholder="Confirme a nova senha"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleUpdatePassword}
                                    disabled={updating}
                                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-70"
                                >
                                    {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Atualizar Senha
                                </button>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h3 className="text-red-800 font-bold mb-2">Zona de Perigo</h3>
                            <p className="text-red-600 text-sm mb-4">
                                A exclusão da sua conta é irreversível. Todos os seus dados serão apagados permanentemente.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={updating}
                                className="text-red-600 text-sm font-bold border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                {updating ? 'Processando...' : 'Excluir Minha Conta'}
                            </button>
                        </div>
                    </div>
                )
            case 'subscription':
                return (
                    <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                        {/* Plan Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <CreditCard size={120} />
                            </div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-orange-100 text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">Plano Atual</span>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Plano Gratuito</h2>
                                    <p className="text-slate-500 text-sm">Ideal para quem está começando.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-800">R$ 0</div>
                                    <div className="text-xs text-slate-400">/ mês</div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">Currículos</div>
                                    <div className="font-bold text-slate-800">1 de 2</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">Downloads PDF</div>
                                    <div className="font-bold text-slate-800">Ilimitado</div>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Banner */}
                        <div className="bg-gradient-to-r from-[var(--primary)] to-orange-600 rounded-xl p-8 text-white relative overflow-hidden shadow-lg shadow-orange-200">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Faça Upgrade para o Premium 🚀</h3>
                                <p className="text-orange-100 mb-6 max-w-sm">Crie currículos ilimitados, acesse templates exclusivos e use nossa IA para gerar textos incríveis.</p>
                                <button onClick={() => navigate('/upgrade')} className="bg-white text-[var(--primary)] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors shadow-md">
                                    Ver Planos e Preços
                                </button>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 h-screen flex flex-row overflow-hidden pb-24 md:pb-0">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header
                    title="Configurações"
                    subtitle="Gerencie seus dados e assinatura."
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-5xl">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Tabs Navigation */}
                            <div className="w-full md:w-64 shrink-0 space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'}`}
                                >
                                    <User size={18} /> Meus Dados
                                </button>
                                <button
                                    onClick={() => setActiveTab('account')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'account' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'}`}
                                >
                                    <Lock size={18} /> Conta e Segurança
                                </button>
                                <button
                                    onClick={() => setActiveTab('subscription')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'subscription' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'}`}
                                >
                                    <CreditCard size={18} /> Assinatura
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 w-full">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Settings
