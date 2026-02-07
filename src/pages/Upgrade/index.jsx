
import React, { useState } from 'react'
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
    const [billingCycle, setBillingCycle] = useState('monthly')

    const getPrice = () => {
        switch (billingCycle) {
            case 'monthly': return { value: '10', label: '/mês', desc: 'Flexibilidade total' }
            case 'yearly': return { value: '100', label: '/ano', desc: 'Economize 17%' }
            case 'lifetime': return { value: '300', label: '/único', desc: 'Pague uma única vez' }
            default: return { value: '10', label: '/mês', desc: 'Flexibilidade total' }
        }
    }

    const priceInfo = getPrice()

    const handleSubscribe = () => {
        let paymentLink = ''
        switch (billingCycle) {
            case 'monthly': paymentLink = import.meta.env.VITE_STRIPE_LINK_MONTHLY; break;
            case 'yearly': paymentLink = import.meta.env.VITE_STRIPE_LINK_YEARLY; break;
            case 'lifetime': paymentLink = import.meta.env.VITE_STRIPE_LINK_LIFETIME; break;
            default: toast.error('Plano inválido.'); return;
        }

        if (!paymentLink || paymentLink.includes('test_')) {
            toast.error('Link de pagamento não configurado.')
            return
        }

        if (!user) {
            toast.error('Você precisa estar logado para assinar.')
            return
        }

        window.location.href = `${paymentLink}?client_reference_id=${user.id}`
    }

    return (
        <div className="bg-[#f8f9fa] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 h-screen flex flex-row overflow-hidden pb-24 md:pb-0">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header title="Seja Premium" subtitle="Desbloqueie todo o potencial da sua carreira." />

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-5xl mx-auto space-y-12">

                        {/* Banner */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-2xl font-bold mb-2">Invista na sua carreira 💼</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Pare de perder oportunidades. Tenha um currículo que os recrutadores amam.
                                </p>
                            </div>
                        </div>

                        {/* Pricing Cards (2 Columns) */}
                        <div className="grid md:grid-cols-2 gap-8 items-start justify-center max-w-4xl mx-auto">

                            {/* Free */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full">
                                <div className="mb-4">
                                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Grátis
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-4xl font-extrabold text-slate-800 dark:text-white">R$ 0</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Para quem está começando agora.</p>

                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <CheckCircle size={20} className="text-[var(--primary)] shrink-0" />
                                        <span>2 Currículos Gratuitos</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <CheckCircle size={20} className="text-[var(--primary)] shrink-0" />
                                        <span>Exportação em PDF</span>
                                    </li>
                                </ul>

                                <button className="w-full py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 font-bold cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 mt-auto">
                                    Seu Plano Atual
                                </button>
                            </div>

                            {/* Pro (Orange Gradient) */}
                            <div className="bg-gradient-to-b from-[var(--primary)] to-orange-600 rounded-2xl p-1 shadow-2xl relative transform md:scale-105 flex flex-col text-white">
                                <div className="absolute top-0 right-0 bg-white text-[var(--primary)] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">
                                    MAIS POPULAR
                                </div>

                                <div className="p-8 flex flex-col h-full relative z-0">
                                    {/* Blobs background effect */}
                                    <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-white opacity-10 blur-3xl rounded-full pointer-events-none"></div>
                                    <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-orange-300 opacity-20 blur-3xl rounded-full pointer-events-none"></div>

                                    <div className="mb-4 relative">
                                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                                            PRO
                                        </span>
                                    </div>

                                    <div className="mb-1 flex items-baseline gap-2 relative">
                                        <span className="text-5xl font-extrabold text-white">R$ {priceInfo.value}</span>
                                        <span className="text-lg text-orange-100">{priceInfo.label}</span>
                                    </div>
                                    <p className="text-orange-50 font-medium text-sm mb-8 relative">{priceInfo.desc}</p>

                                    <ul className="space-y-4 mb-8 flex-1 relative">
                                        <li className="flex items-center gap-3 text-white font-bold">
                                            <CheckCircle size={20} className="text-white shrink-0" />
                                            <span>Currículos Ilimitados</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-white">
                                            <CheckCircle size={20} className="text-white shrink-0" />
                                            <span>Acesso a Novos Modelos</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-white">
                                            <CheckCircle size={20} className="text-white shrink-0" />
                                            <span>Sem Marca D'água</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-orange-100 opacity-90">
                                            <CheckCircle size={20} className="text-orange-200 shrink-0" />
                                            <span>Tradução Automática (Em Breve)</span>
                                        </li>
                                    </ul>

                                    {/* Updated Toggle Styles for Orange Background */}
                                    <div className="bg-black/20 p-1 rounded-lg flex mb-6 relative backdrop-blur-sm">
                                        <button
                                            onClick={() => setBillingCycle('monthly')}
                                            className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-orange-100 hover:bg-white/10'}`}
                                        >
                                            Mensal
                                        </button>
                                        <button
                                            onClick={() => setBillingCycle('yearly')}
                                            className={`flex-1 py-2 rounded-md text-xs font-bold transition-all relative ${billingCycle === 'yearly' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-orange-100 hover:bg-white/10'}`}
                                        >
                                            Anual
                                            {/* -17% Tag */}
                                            <span className="absolute -top-3 -right-2 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-sm font-bold">-17%</span>
                                        </button>
                                        <button
                                            onClick={() => setBillingCycle('lifetime')}
                                            className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${billingCycle === 'lifetime' ? 'bg-white text-purple-600 shadow-sm' : 'text-orange-100 hover:bg-white/10'}`}
                                        >
                                            Vitalício
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleSubscribe}
                                        className="w-full py-3.5 rounded-lg bg-white text-[var(--primary)] font-bold hover:bg-orange-50 transition-colors shadow-lg relative"
                                    >
                                        Assinar Agora
                                    </button>
                                </div>
                            </div>

                        </div>

                        <p className="text-center text-xs text-slate-400">
                            Pagamento seguro processado por Stripe. Cancele quando quiser.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Upgrade
