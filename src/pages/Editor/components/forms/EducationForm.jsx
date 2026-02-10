import React from 'react'
import { GraduationCap, ChevronDown, Trash2, PlusCircle } from 'lucide-react'
import MonthYearPicker from '../ui/MonthYearPicker'

const EducationForm = ({ resumeData, activeSection, toggleSection, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${activeSection === 'education' ? 'border-[var(--primary)] ring-1 ring-orange-100' : 'border-gray-200 hover:border-orange-200'}`}>
            <button onClick={() => toggleSection('education')} className="w-full flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeSection === 'education' ? 'bg-orange-100 text-[var(--primary)]' : 'bg-gray-50 text-slate-500'}`}>
                        <GraduationCap size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Educação</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeSection === 'education' ? 'rotate-180' : ''}`} />
            </button>

            {activeSection === 'education' && (
                <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {resumeData.education.map((edu, index) => (
                        <div key={edu.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                            <button
                                onClick={() => removeArrayItem('education', index)}
                                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Instituição</label>
                                <input value={edu.school} onChange={(e) => updateArrayItem('education', index, 'school', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Ex: Universidade Anhembi Morumbi" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Localização</label>
                                <input
                                    value={edu.location || ''}
                                    onChange={(e) => updateArrayItem('education', index, 'location', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    placeholder="Cidade, Estado"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Curso / Grau</label>
                                <input value={edu.degree} onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Ex: Bacharelado em Design" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Início</label>
                                    <MonthYearPicker
                                        value={edu.startDate}
                                        onChange={(val) => updateArrayItem('education', index, 'startDate', val)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fim</label>
                                    <div className="space-y-2">
                                        <MonthYearPicker
                                            value={edu.endDate}
                                            onChange={(val) => updateArrayItem('education', index, 'endDate', val)}
                                            disabled={edu.isCurrent}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={edu.isCurrent}
                                                onChange={(e) => updateArrayItem('education', index, 'isCurrent', e.target.checked)}
                                                className="rounded border-slate-300 text-[var(--primary)] focus:ring-orange-200"
                                                id={`edu-current-${index}`}
                                            />
                                            <label htmlFor={`edu-current-${index}`} className="text-xs text-slate-500 font-medium cursor-pointer">Estudo aqui atualmente</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => addArrayItem('education', { id: Date.now(), school: '', degree: '', location: '', startDate: '', endDate: '', isCurrent: false })}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={18} /> Adicionar Educação
                    </button>
                </div>
            )}
        </div>
    )
}

export default EducationForm
