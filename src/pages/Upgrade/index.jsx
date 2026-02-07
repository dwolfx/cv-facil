
import React, { useState, useEffect } from 'react'
import { CheckCircle, Zap, Star, ShieldCheck, Crown, Infinity, Globe } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../../components/Sidebar'
import UserDropdown from '../../components/UserDropdown'
import PlanWidget from '../../components/PlanWidget'

import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../services/supabaseClient'
import { useUserPlan } from '../../hooks/useUserPlan'

const Upgrade = () => {
    const { user } = useAuth()
    const { features } = useUserPlan(user || {})
    const [billingCycle, setBillingCycle] = useState('monthly')
    const [resumeCount, setResumeCount] = useState(0)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            toast.success('Pagamento recebido! 🚀', {
                description: 'Sua assinatura está sendo ativada. Pode levar alguns instantes.',
                duration: 8000,
            })
            // Clear the URL param
            const url = new URL(window.location)
            url.searchParams.delete('success')
            window.history.replaceState({}, '', url)
        }
    }, [searchParams])

    useEffect(() => {
        if (user) {
            const fetchCount = async () => {
                const { count } = await supabase
                    .from('resumes')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                setResumeCount(count || 0)
            }
            fetchCount()
        }
    }, [user])

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
                <Header
                    title="Seja Premium"
                    subtitle="Desbloqueie todo o potencial da sua carreira."
                    planCurrent={resumeCount}
                    planMax={features?.maxResumes || 2}
                    isPremium={features?.isPremium || false}
                />

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-5xl mx-auto space-y-12">

                        {/* Hero Section */}
                        <div className="text-center py-12 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[var(--primary)]/20 blur-[100px] rounded-full pointer-events-none"></div>

                            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-6 border border-orange-200 dark:border-orange-800 relative z-10">
                                Potencialize sua Carreira
                            </span>

                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight relative z-10">
                                Seu currículo no <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Próximo Nível</span>
                            </h1>

                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed relative z-10">
                                Pare de ser ignorado pelos recrutadores. Desbloqueie ferramentas exclusivas e conquiste a vaga dos seus sonhos hoje mesmo.
                            </p>
                        </div>

                        {/* Why Premium Section */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-white">O que você ganha sendo Premium?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Ilimitado */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-orange-100 dark:bg-orange-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-orange-600 dark:text-orange-400">
                                        <Infinity size={20} />
                                    </div>
                                    <h4 className="font-bold text-base mb-1 dark:text-white">Ilimitado</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Crie versões diferentes para cada vaga sem restrições.</p>
                                </div>

                                {/* Layouts (Em Breve) */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-purple-600 dark:text-purple-400">
                                        <Crown size={20} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-base dark:text-white">Layouts</h4>
                                        <span className="text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 dark:border-slate-600 font-medium">Em Breve</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Modelos exclusivos desenhados para destacar você.</p>
                                </div>

                                {/* Tradução (Em Breve) */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                                        <Globe size={20} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-base dark:text-white">Tradução</h4>
                                        <span className="text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 dark:border-slate-600 font-medium">Em Breve</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Versões em Inglês e Espanhol com um clique.</p>
                                </div>

                                {/* IA (Em Breve) */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-emerald-600 dark:text-emerald-400">
                                        <Zap size={20} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-base dark:text-white">IA Review</h4>
                                        <span className="text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 dark:border-slate-600 font-medium">Em Breve</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Sugestões inteligentes para melhorar seu texto.</p>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div>
                            <h3 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-white">Invista Agora no Seu Futuro 🚀</h3>

                            {/* Pricing Cards (2 Columns) */}
                            <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-start justify-center max-w-4xl mx-auto">

                                {/* Free (Compact Mobile) */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full opacity-80 hover:opacity-100 transition-opacity transform md:scale-95 origin-top">
                                    <div className="mb-2 md:mb-4">
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                            Grátis
                                        </span>
                                    </div>
                                    <div className="mb-1 md:mb-2">
                                        <span className="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white">R$ 0</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-4 md:mb-8">Para quem está começando agora.</p>

                                    <ul className="space-y-2 md:space-y-4 mb-4 md:mb-8 flex-1">
                                        <li className="flex items-center gap-2 md:gap-3 text-slate-600 dark:text-slate-300 text-xs md:text-base">
                                            <CheckCircle size={16} className="text-[var(--primary)] shrink-0 md:w-5 md:h-5" />
                                            <span>2 Currículos Gratuitos</span>
                                        </li>
                                        <li className="flex items-center gap-2 md:gap-3 text-slate-600 dark:text-slate-300 text-xs md:text-base">
                                            <CheckCircle size={16} className="text-[var(--primary)] shrink-0 md:w-5 md:h-5" />
                                            <span>Exportação em PDF</span>
                                        </li>
                                    </ul>

                                    <button className="w-full py-2 md:py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 font-bold cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 mt-auto text-xs md:text-base">
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

                            <p className="text-center text-xs text-slate-400 mt-12 relative z-10">
                                Pagamento seguro processado por Stripe. Cancele quando quiser.
                            </p>
                        </div>

                        {/* Testimonials Section */}
                        <div className="pb-8">
                            <h3 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-white">Quem usa, aprova ⭐</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* T1 */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                    <p className="text-slate-600 dark:text-slate-300 italic mb-4 text-sm flex-1">"O modelo Premium me ajudou a passar na triagem da vaga que eu tanto queria. Valeu cada centavo!"</p>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">JP</div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">João Paulo</p>
                                            <p className="text-xs text-slate-400">Analista Jr.</p>
                                        </div>
                                    </div>
                                </div>
                                {/* T2 */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                    <p className="text-slate-600 dark:text-slate-300 italic mb-4 text-sm flex-1">"Muito fácil de usar. Criei 5 versões diferentes do meu CV em menos de 10 minutos."</p>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">ML</div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">Mariana Lima</p>
                                            <p className="text-xs text-slate-400">Designer</p>
                                        </div>
                                    </div>
                                </div>
                                {/* T3 - New */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                    <p className="text-slate-600 dark:text-slate-300 italic mb-4 text-sm flex-1">"Simples, rápido e o resultado é muito profissional. Recomendo para todos!"</p>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">CE</div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">Carlos Eduardo</p>
                                            <p className="text-xs text-slate-400">Engenheiro</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}

export default Upgrade
