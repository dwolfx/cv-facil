import React from 'react'
import { Briefcase, ChevronDown, Trash2, PlusCircle } from 'lucide-react'

const ExperienceForm = ({ resumeData, activeSection, toggleSection, updateArrayItem, addArrayItem, removeArrayItem, formatDateInput }) => {
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
                <div className="p-4 pt-0 space-y-4">
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
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Empresa</label>
                                <input
                                    value={exp.company}
                                    onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Início</label>
                                    <input
                                        value={exp.startDate}
                                        onChange={(e) => updateArrayItem('experience', index, 'startDate', formatDateInput(e.target.value))}
                                        placeholder="MM/AAAA"
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fim</label>
                                    <input
                                        value={exp.endDate}
                                        onChange={(e) => updateArrayItem('experience', index, 'endDate', formatDateInput(e.target.value))}
                                        placeholder="MM/AAAA"
                                        disabled={exp.isCurrent}
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Descrição</label>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm h-24 resize-y"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => addArrayItem('experience', { id: Date.now(), position: '', company: '', startDate: '', endDate: '', description: '', isCurrent: false })}
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
