
import React from 'react'
import { CheckCircle, Zap, Star, ShieldCheck, Crown, Infinity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../../components/Sidebar'
import UserDropdown from '../../components/UserDropdown'
import PlanWidget from '../../components/PlanWidget'

import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'

const Upgrade = () => {
    const { user } = useAuth()

    const handleSubscribe = (plan) => {
        let paymentLink = ''

        // Select link based on plan
        switch (plan) {
            case 'Mensal':
                paymentLink = import.meta.env.VITE_STRIPE_LINK_MONTHLY
                break
            case 'Anual':
                paymentLink = import.meta.env.VITE_STRIPE_LINK_YEARLY
                break
            case 'Vitalício':
                paymentLink = import.meta.env.VITE_STRIPE_LINK_LIFETIME
                break
            default:
                toast.error('Plano inválido.')
                return
        }

        if (!paymentLink || paymentLink.includes('test_')) {
            toast.error('Link de pagamento não configurado no .env')
            console.error('Missing VITE_STRIPE_LINK for:', plan)
            return
        }

        if (!user) {
            toast.error('Você precisa estar logado para assinar.')
            return
        }

        // Redirect to Stripe with secure User ID reference
        const finalUrl = `${paymentLink}?client_reference_id=${user.id}`
        window.location.href = finalUrl
    }

    return (
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 h-screen flex flex-row overflow-hidden pb-24 md:pb-0">
            {/* Shared Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header
                    title="Seja Premium"
                    subtitle="Desbloqueie todo o potencial da sua carreira."
                />

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Hero Section */}
                        {/* Hero Section */}
                        <div className="relative max-w-4xl mx-auto py-8 overflow-hidden px-4">
                            {/* Visual Blobs (Background) */}
                            <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-40 z-0 pointer-events-none animate-pulse"
                                style={{ background: 'var(--gradient-main)' }}></div>
                            <div className="absolute bottom-[-20%] left-[-10%] w-[250px] h-[250px] rounded-full blur-[60px] opacity-20 z-0 pointer-events-none bg-slate-400 dark:bg-slate-600"></div>

                            {/* Content */}
                            <div className="relative z-10 text-center space-y-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-[var(--primary)] text-xs font-bold uppercase tracking-wider rounded-full border border-orange-200 dark:border-orange-800 shadow-sm">
                                    <Zap size={14} className="fill-current" /> Oferta Especial
                                </span>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                                    Invista na sua carreira <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-orange-600">
                                        por menos de um café
                                    </span> ☕
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                    Milhares de candidatos são reprovados por currículos ruins.
                                    Garanta que o seu se destaque com nossas ferramentas profissionais e conquiste a vaga dos sonhos.
                                </p>
                            </div>
                        </div>

                        {/* Free vs Premium Features */}
                        <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="space-y-6">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-500" />
                                    O que você já tem (Grátis):
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span><b>Otimizado para ATS (Gupy, Kenoby)</b>: Seu CV passa nos robôs de recrutamento.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span>Exportação em PDF Profissional</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span>2 Currículos Gratuitos</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-6 pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-8 md:pt-0">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-[var(--primary)]">
                                    <Crown className="text-[var(--primary)]" />
                                    Benefícios do Premium:
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-white font-medium">
                                        <Infinity size={18} className="text-[var(--primary)] shrink-0 mt-0.5" />
                                        <span><b>Currículos Ilimitados</b>: Crie versões para cada vaga.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <Zap size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <span><b>Em Breve</b>: Inteligência Artificial para escrever seus textos.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <Zap size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <span><b>Em Breve</b>: Tradução automática (Inglês/Espanhol).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <Zap size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <span><b>Em Breve</b>: Modelos exclusivos e personalizáveis.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-3 gap-6">

                            {/* Monthly */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Mensal</h3>
                                    <p className="text-xs text-slate-500">Flexibilidade total</p>
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">R$ 5</span>
                                    <span className="text-slate-500">/mês</span>
                                </div>
                                <button onClick={() => handleSubscribe('Mensal')} className="w-full py-2.5 rounded-lg border border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-orange-50 transition-colors mb-4">
                                    Assinar Mensal
                                </button>
                                <ul className="space-y-2 mt-auto">
                                    <li className="text-xs text-slate-500 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Cancele quando quiser</li>
                                </ul>
                            </div>

                            {/* Yearly */}
                            <div className="bg-gradient-to-b from-[var(--primary)] to-orange-600 rounded-2xl p-6 shadow-xl shadow-orange-200 flex flex-col hover:-translate-y-1 transition-transform duration-300 relative transform md:scale-105 z-10">
                                <span className="absolute top-0 right-0 bg-white text-[var(--primary)] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Mais Popular</span>
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-white">Anual</h3>
                                    <p className="text-xs text-orange-100">Economize 17%</p>
                                </div>
                                <div className="mb-6 text-white">
                                    <span className="text-4xl font-extrabold">R$ 50</span>
                                    <span className="text-orange-100">/ano</span>
                                </div>
                                <button onClick={() => handleSubscribe('Anual')} className="w-full py-3 rounded-lg bg-white text-[var(--primary)] font-bold hover:bg-orange-50 transition-colors mb-4 shadow-lg">
                                    Assinar Agora
                                </button>
                                <ul className="space-y-2 mt-auto">
                                    <li className="text-xs text-orange-100 flex items-center gap-2"><CheckCircle size={14} className="text-white" /> Apenas R$ 4,16/mês</li>
                                    <li className="text-xs text-orange-100 flex items-center gap-2"><CheckCircle size={14} className="text-white" /> Acesso imediato a tudo</li>
                                </ul>
                            </div>

                            {/* Lifetime */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Vitalício</h3>
                                    <p className="text-xs text-slate-500">Pague uma única vez</p>
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">R$ 150</span>
                                    <span className="text-slate-500">/único</span>
                                </div>
                                <button onClick={() => handleSubscribe('Vitalício')} className="w-full py-2.5 rounded-lg border-2 border-slate-800 text-slate-800 font-bold hover:bg-slate-100 transition-colors mb-4">
                                    Comprar Acesso
                                </button>
                                <ul className="space-y-2 mt-auto">
                                    <li className="text-xs text-slate-500 flex items-center gap-2"><Star size={14} className="text-amber-500" /> Acesso pra sempre</li>
                                    <li className="text-xs text-slate-500 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Sem mensalidades</li>
                                </ul>
                            </div>

                        </div>

                        <p className="text-center text-xs text-slate-400 pb-8">
                            Pagamento seguro processado por Stripe. Garantia de 7 dias ou seu dinheiro de volta.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Upgrade
