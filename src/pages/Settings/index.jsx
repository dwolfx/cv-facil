import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { User, Lock, CreditCard, Save } from 'lucide-react'
import { toast } from 'sonner'
import Sidebar from '../../components/Sidebar'
import UserDropdown from '../../components/UserDropdown'
import PlanWidget from '../../components/PlanWidget'

const Settings = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')

    // Mock User Data
    const [userData, setUserData] = useState({
        name: 'Ricardo Silva',
        email: 'victor9009@gmail.com',
        phone: '(11) 99999-9999'
    })

    const handleSave = () => {
        toast.success('Configurações salvas com sucesso!')
    }

    const renderContent = () => {
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
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
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
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-200">
                                    <Save size={16} /> Salvar Alterações
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
                                    <input type="password" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nova Senha</label>
                                    <input type="password" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirmar Nova Senha</label>
                                    <input type="password" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                <button onClick={handleSave} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                    <Save size={16} /> Atualizar Senha
                                </button>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h3 className="text-red-800 font-bold mb-2">Zona de Perigo</h3>
                            <p className="text-red-600 text-sm mb-4">A exclusão da sua conta é irreversível. Todos os seus currículos serão apagados.</p>
                            <button className="text-red-600 text-sm font-bold border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                                Excluir minha conta
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
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 h-screen flex flex-row overflow-hidden pb-16 md:pb-0">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 md:px-8 h-16 md:h-20 border-b border-slate-200 dark:border-slate-800 shrink-0 z-10">
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-none">Configurações</h1>
                        <p className="text-[10px] md:text-xs text-slate-500 hidden md:block">Gerencie seus dados e assinatura.</p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        <PlanWidget current={1} max={2} />
                        <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
                        <UserDropdown />
                    </div>
                </header>

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
