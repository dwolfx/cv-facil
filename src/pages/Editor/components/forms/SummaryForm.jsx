import React from 'react'
import { FileText, ChevronDown } from 'lucide-react'

const SummaryForm = ({ resumeData, activeSection, toggleSection, updateField }) => {
    return (
        <div className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${activeSection === 'summary' ? 'border-[var(--primary)] ring-1 ring-orange-100' : 'border-gray-200 hover:border-orange-200'}`}>
            <button
                onClick={() => toggleSection('summary')}
                className="w-full flex items-center justify-between p-4"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeSection === 'summary' ? 'bg-orange-100 text-[var(--primary)]' : 'bg-gray-50 text-slate-500'}`}>
                        <FileText size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Sobre mim</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeSection === 'summary' ? 'rotate-180' : ''}`} />
            </button>
            {activeSection === 'summary' && (
                <div className="p-4 pt-0">
                    <textarea
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => updateField('personalInfo', 'summary', e.target.value)}
                        className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all resize-none"
                        placeholder="Escreva um breve resumo sobre sua carreira..."
                    />
                </div>
            )}
        </div>
    )
}

export default SummaryForm
