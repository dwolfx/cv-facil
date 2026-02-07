import React from 'react'
import { Wrench, ChevronDown, Trash2 } from 'lucide-react'

const SkillsForm = ({ resumeData, activeSection, toggleSection, addArrayItem, removeArrayItem }) => {
    return (
        <div className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${activeSection === 'skills' ? 'border-[var(--primary)] ring-1 ring-orange-100' : 'border-gray-200 hover:border-orange-200'}`}>
            <button onClick={() => toggleSection('skills')} className="w-full flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeSection === 'skills' ? 'bg-orange-100 text-[var(--primary)]' : 'bg-gray-50 text-slate-500'}`}>
                        <Wrench size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Habilidades</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeSection === 'skills' ? 'rotate-180' : ''}`} />
            </button>
            {activeSection === 'skills' && (
                <div className="p-4 pt-0 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full text-sm text-slate-700 animate-in zoom-in-50">
                                <span>{skill}</span>
                                <button onClick={() => removeArrayItem('skills', index)} className="ml-2 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            id="skill-input"
                            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="Adicionar habilidade (Enter)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    addArrayItem('skills', e.target.value.trim())
                                    e.target.value = ''
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                const input = document.getElementById('skill-input')
                                if (input.value.trim()) {
                                    addArrayItem('skills', input.value.trim())
                                    input.value = ''
                                }
                            }}
                            className="bg-[var(--primary)] text-white px-4 rounded-lg font-bold text-sm"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SkillsForm
