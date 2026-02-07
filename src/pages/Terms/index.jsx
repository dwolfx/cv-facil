
import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'

const Terms = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link to="/" className="inline-flex items-center text-slate-600 hover:text-orange-500 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Voltar para Início
                </Link>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <FileText size={32} className="text-orange-500" />
                        <h1 className="text-2xl font-bold text-slate-800">Termos de Uso e Política de Privacidade</h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
                        <p className="text-sm text-slate-400">Última atualização: Fevereiro de 2026</p>

                        <section>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">1. Aceitação dos Termos</h2>
                            <p>
                                Ao criar uma conta e utilizar os serviços do <strong>CVFácil</strong>, você concorda expressamente com estes Termos de Uso e Política de Privacidade.
                                Se você não concordar com qualquer parte destes termos, você não deve utilizar nossos serviços.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">2. Coleta e Armazenamento de Dados</h2>
                            <p>
                                Você autoriza expressamente o CVFácil a coletar, armazenar e processar todas as informações fornecidas por você durante o cadastro e criação de currículos,
                                incluindo, mas não se limitando a: dados pessoais, histórico profissional, formação acadêmica, habilidades e informações de contato.
                            </p>
                            <p className="mt-2">
                                Seus dados serão armazenados em nossos servidores seguros e serão utilizados para:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Fornecer e melhorar nossos serviços de edição e geração de currículos.</li>
                                <li>Comunicar novidades, atualizações e ofertas relevantes.</li>
                                <li>Análise estatística e melhoria da inteligência artificial da plataforma.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">3. Uso Comercial e Compartilhamento de Dados</h2>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-orange-900 text-sm">
                                <strong>ATENÇÃO:</strong> Cláusula de Autorização de Compartilhamento
                            </div>
                            <p className="mt-2">
                                Ao aceitar estes termos, você concede ao CVFácil uma licença perpétua, irrevogável e mundial para:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>
                                    Compartilhar, ceder ou comercializar sua base de dados de currículos com empresas parceiras, agências de recrutamento e seleção,
                                    headhunters e plataformas de empregabilidade ("Parceiros").
                                </li>
                                <li>
                                    Permitir que estes Parceiros entrem em contato com você para ofertas de emprego, processos seletivos e oportunidades de carreira
                                    baseadas em seu perfil profissional.
                                </li>
                            </ul>
                            <p className="mt-2">
                                O objetivo deste compartilhamento é aumentar sua visibilidade no mercado de trabalho e conectar você a novas oportunidades.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">4. Responsabilidades do Usuário</h2>
                            <p>
                                Você declara que todas as informações fornecidas são verdadeiras e precisas. O CVFácil não se responsabiliza pela veracidade dos dados
                                inseridos nos currículos, sendo esta de total responsabilidade do usuário.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">5. Cancelamento e Exclusão</h2>
                            <p>
                                Você pode solicitar a exclusão da sua conta a qualquer momento através das configurações do painel. Após a exclusão, seus dados
                                serão removidos de nossa base ativa, mas poderão ser mantidos em backups por um período determinado por lei ou para fins de auditoria.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <Link to="/register" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                            Voltar e Criar Conta
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terms
