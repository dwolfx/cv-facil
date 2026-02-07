
import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react'

const Contact = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <Link to="/" className="inline-flex items-center text-slate-400 hover:text-orange-500 mb-6 transition-colors font-semibold text-sm">
                    <ArrowLeft size={16} className="mr-2" /> Voltar
                </Link>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">Fale Conosco</h1>
                <p className="text-slate-500 mb-8">
                    Tem alguma dúvida ou sugestão? Entre em contato diretamente com o desenvolvedor.
                </p>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">E-mail</h3>
                            <p className="text-slate-500 text-sm mb-1">Para suporte técnico e dúvidas gerais.</p>
                            <a href="mailto:victor9009@gmail.com" className="text-orange-600 font-medium hover:underline">
                                victor9009@gmail.com
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">WhatsApp</h3>
                            <p className="text-slate-500 text-sm mb-1">Atendimento rápido para assinantes.</p>
                            <a href="https://wa.me/5511951565851" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">
                                (11) 95156-5851
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Responderemos sua mensagem em até 24 horas úteis.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Contact
