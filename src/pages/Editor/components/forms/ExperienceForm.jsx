import React from 'react'
import { Briefcase, ChevronDown, Trash2, PlusCircle } from 'lucide-react'
import RichTextarea from '../ui/RichTextarea'
import MonthYearPicker from '../ui/MonthYearPicker'

const ExperienceForm = ({ resumeData, activeSection, toggleSection, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${activeSection === 'experience' ? 'border-[var(--primary)] ring-1 ring-orange-100' : 'border-gray-200 hover:border-orange-200'}`}>
            <button onClick={() => toggleSection('experience')} className="w-full flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeSection === 'experience' ? 'bg-orange-100 text-[var(--primary)]' : 'bg-gray-50 text-slate-500'}`}>
                        <Briefcase size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Experiência Profissional</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeSection === 'experience' ? 'rotate-180' : ''}`} />
            </button>

            {activeSection === 'experience' && (
                <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {resumeData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                            <button
                                onClick={() => removeArrayItem('experience', index)}
                                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Cargo</label>
                                <input
                                    value={exp.position}
                                    onChange={(e) => updateArrayItem('experience', index, 'position', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                    placeholder="Ex: Gerente de Projetos"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Empresa</label>
                                <input
                                    value={exp.company}
                                    onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                    placeholder="Ex: Empresa X"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Localização</label>
                                <input
                                    value={exp.location || ''}
                                    onChange={(e) => updateArrayItem('experience', index, 'location', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                    placeholder="Cidade, Estado"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Início</label>
                                    <MonthYearPicker
                                        value={exp.startDate}
                                        onChange={(val) => updateArrayItem('experience', index, 'startDate', val)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fim</label>
                                    <div className="space-y-2">
                                        <MonthYearPicker
                                            value={exp.endDate}
                                            onChange={(val) => updateArrayItem('experience', index, 'endDate', val)}
                                            disabled={exp.isCurrent}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={exp.isCurrent}
                                                onChange={(e) => updateArrayItem('experience', index, 'isCurrent', e.target.checked)}
                                                className="rounded border-slate-300 text-[var(--primary)] focus:ring-orange-200"
                                                id={`current-${index}`}
                                            />
                                            <label htmlFor={`current-${index}`} className="text-xs text-slate-500 font-medium cursor-pointer">Trabalho aqui atualmente</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 pt-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                                    <span>Descrição</span>
                                </label>
                                <RichTextarea
                                    value={exp.description}
                                    onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all resize-none"
                                    placeholder="Descreva suas principais atividades e conquistas..."
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => addArrayItem('experience', { id: Date.now(), position: '', company: '', location: '', startDate: '', endDate: '', description: '', isCurrent: false })}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={18} /> Adicionar Experiência
                    </button>
                </div>
            )}
        </div>
    )
}

export default ExperienceForm
