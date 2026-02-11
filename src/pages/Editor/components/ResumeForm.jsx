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

    const getStrengthTheme = (s) => {
        if (s < 40) return "bg-red-50 border-red-100"
        if (s <= 80) return "bg-orange-50 border-orange-100"
        return "bg-emerald-50 border-emerald-100"
    }

    const getStrengthTextColor = (s) => {
        if (s < 40) return "text-red-700"
        if (s <= 80) return "text-orange-700"
        return "text-emerald-700"
    }

    const getStrengthColor = (s) => {
        if (s < 40) return 'from-red-500 to-red-600'
        if (s <= 80) return 'from-orange-400 to-orange-600'
        return 'from-emerald-400 to-emerald-600'
    }

    return (
        <div className="p-6 pb-32 md:pb-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-[var(--primary)]" />
                Conteúdo do Currículo
            </h2>

            {/* STRENGTH WIDGET */}
            <div className={`p-4 rounded-xl border shadow-sm grid gap-2 ${getStrengthTheme(strength)}`}>
                <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold uppercase tracking-wider ${getStrengthTextColor(strength)}`}>Força do Currículo</span>
                    <span className={`text-xs font-bold ${getStrengthTextColor(strength)}`}>{strength}%</span>
                </div>
                <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getStrengthColor(strength)} transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${strength}%` }}
                    />
                </div>
                <p className={`text-[10px] mt-1 font-medium ${getStrengthTextColor(strength)} opacity-80`}>
                    {strength < 40 ? 'Adicione mais informações essenciais.' : strength < 80 ? 'Bom começo! Detalhe mais suas experiências.' : 'Currículo forte! Pronto para enviar.'}
                </p>
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
