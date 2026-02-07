import React from 'react'
import { User, ChevronDown, Mail, Phone, Globe, PlusCircle, Trash2 } from 'lucide-react'

const PersonalInfoForm = ({ resumeData, activeSection, toggleSection, updateField, handleLocationChange }) => {

    // Local formatters could be here or passed down. Assuming simple handlers for now.
    const handleChange = (field, value) => updateField('personalInfo', field, value)

    return (
        <div className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${activeSection === 'personal' ? 'border-[var(--primary)] ring-1 ring-orange-100' : 'border-gray-200 hover:border-orange-200'}`}>
            <button
                onClick={() => toggleSection('personal')}
                className="w-full flex items-center justify-between p-4"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeSection === 'personal' ? 'bg-orange-100 text-[var(--primary)]' : 'bg-gray-50 text-slate-500'}`}>
                        <User size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Dados Pessoais</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeSection === 'personal' ? 'rotate-180' : ''}`} />
            </button>

            {activeSection === 'personal' && (
                <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                        <input
                            value={resumeData.personalInfo.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                            placeholder="Seu nome completo"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Cargo</label>
                        <input
                            value={resumeData.personalInfo.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                            placeholder="Ex: Desenvolvedor Front-End"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                value={resumeData.personalInfo.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Telefone</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                value={resumeData.personalInfo.phone}
                                onChange={(e) => handleChange('phone', e.target.value)} // Formatting happens in parent wrapper or here if moved
                                maxLength={15}
                                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nacionalidade</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                value={resumeData.personalInfo.nationality}
                                onChange={(e) => handleChange('nationality', e.target.value)}
                                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                placeholder="Brasileiro"
                            />
                        </div>
                    </div>


                    {/* Locations Array */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-500 uppercase block">Localização</label>
                        {resumeData.personalInfo.locations?.map((loc, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={loc}
                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    placeholder="Cidade, Estado"
                                />
                                <button
                                    onClick={() => {
                                        const newLocs = resumeData.personalInfo.locations.filter((_, i) => i !== index)
                                        updateField('personalInfo', 'locations', newLocs)
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => updateField('personalInfo', 'locations', [...(resumeData.personalInfo.locations || []), ''])}
                            className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:text-orange-600 transition-colors"
                        >
                            <PlusCircle size={14} /> Adicionar Local
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PersonalInfoForm
