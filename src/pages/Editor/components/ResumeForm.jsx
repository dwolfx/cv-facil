import React from 'react'
import { FileText } from 'lucide-react'

import PersonalInfoForm from './forms/PersonalInfoForm'
import SummaryForm from './forms/SummaryForm'
import ExperienceForm from './forms/ExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import LanguagesForm from './forms/LanguagesForm'

// Formatting helpers
const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '')
    const truncated = digits.slice(0, 11)
    if (truncated.length > 10) return truncated.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
    else if (truncated.length > 5) return truncated.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    else if (truncated.length > 2) return truncated.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
    return truncated
}

const formatDateInput = (value) => {
    const digits = value.replace(/\D/g, '')
    const truncated = digits.slice(0, 6)
    if (truncated.length > 2) {
        return `${truncated.slice(0, 2)}/${truncated.slice(2)}`
    }
    return truncated
}

const ResumeForm = ({
    resumeData,
    activeSection,
    toggleSection,
    updateField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    strength
}) => {

    // Wrapper for Personal Info with formatting logic
    const handlePersonalUpdate = (field, value) => {
        let finalVal = value
        if (field === 'phone') finalVal = formatPhone(value)
        updateField('personalInfo', field, finalVal)
    }

    const handleLocationChange = (index, value) => {
        const newLocs = [...(resumeData.personalInfo.locations || [])]
        newLocs[index] = value
        updateField('personalInfo', 'locations', newLocs)
    }

    return (
        <div className="p-6 pb-32 md:pb-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-[var(--primary)]" />
                Conteúdo do Currículo
            </h2>

            {/* STRENGTH WIDGET */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Força do Currículo</span>
                    <span className="text-xs font-bold text-[var(--primary)]">{strength}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000 ease-out"
                        style={{ width: `${strength}%` }}
                    />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Adicione mais informações para completar.</p>
            </div>

            <PersonalInfoForm
                resumeData={resumeData}
                activeSection={activeSection}
                toggleSection={toggleSection}
                updateField={updateField}
                handleLocationChange={handleLocationChange}
            />

            <SummaryForm
                resumeData={resumeData}
                activeSection={activeSection}
                toggleSection={toggleSection}
                updateField={updateField}
            />

            <ExperienceForm
                resumeData={resumeData}
                activeSection={activeSection}
                toggleSection={toggleSection}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                formatDateInput={formatDateInput}
            />

            <EducationForm
                resumeData={resumeData}
                activeSection={activeSection}
                toggleSection={toggleSection}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                formatDateInput={formatDateInput}
            />

            <SkillsForm
                resumeData={resumeData}
                activeSection={activeSection}
                toggleSection={toggleSection}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
            />

            <LanguagesForm
                resumeData={resumeData}
                activeSection={activeSection}
                toggleSection={toggleSection}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
            />

        </div>
    )
}

export default ResumeForm
