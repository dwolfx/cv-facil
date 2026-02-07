import React from 'react'
import { Globe, ChevronDown, Trash2, PlusCircle } from 'lucide-react'

const LanguagesForm = ({ resumeData, activeSection, toggleSection, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${activeSection === 'languages' ? 'border-[var(--primary)] ring-1 ring-orange-100' : 'border-gray-200 hover:border-orange-200'}`}>
            <button onClick={() => toggleSection('languages')} className="w-full flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeSection === 'languages' ? 'bg-orange-100 text-[var(--primary)]' : 'bg-gray-50 text-slate-500'}`}>
                        <Globe size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Idiomas</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeSection === 'languages' ? 'rotate-180' : ''}`} />
            </button>
            {activeSection === 'languages' && (
                <div className="p-4 pt-0 space-y-4">
                    {resumeData.languages.map((lang, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input value={lang.name} onChange={(e) => updateArrayItem('languages', index, 'name', e.target.value)} placeholder="Idioma" className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            <input value={lang.level} onChange={(e) => updateArrayItem('languages', index, 'level', e.target.value)} placeholder="Nível" className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            <button onClick={() => removeArrayItem('languages', index)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button
                        onClick={() => addArrayItem('languages', { name: '', level: '' })}
                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-xs hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={14} /> Adicionar Idioma
                    </button>
                </div>
            )}
        </div>
    )
}

export default LanguagesForm
