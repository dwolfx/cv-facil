import React from 'react'
import { GraduationCap, ChevronDown, Trash2, PlusCircle } from 'lucide-react'

const EducationForm = ({ resumeData, activeSection, toggleSection, updateArrayItem, addArrayItem, removeArrayItem, formatDateInput }) => {
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
                <div className="p-4 pt-0 space-y-4">
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
                                <input value={edu.school} onChange={(e) => updateArrayItem('education', index, 'school', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Curso / Grau</label>
                                <input value={edu.degree} onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Início</label>
                                    <input value={edu.startDate} onChange={(e) => updateArrayItem('education', index, 'startDate', formatDateInput(e.target.value))} placeholder="MM/AAAA" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fim</label>
                                    <input value={edu.endDate} onChange={(e) => updateArrayItem('education', index, 'endDate', formatDateInput(e.target.value))} placeholder="MM/AAAA" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => addArrayItem('education', { id: Date.now(), school: '', degree: '', startDate: '', endDate: '' })}
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
