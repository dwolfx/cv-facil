
import React from 'react'

const ResumePreview = ({ resumeData, title: resumeTitle }) => {
    // 1. Language Detection
    const getLanguage = () => {
        const title = resumeTitle?.toUpperCase() || ''
        if (title.includes('[EN]')) return 'EN'
        if (title.includes('[ES]')) return 'ES'
        return 'PT' // Default
    }

    const lang = getLanguage()

    // 2. Translations Object
    const t = {
        PT: {
            personalInfo: 'Dados Pessoais',
            email: 'E-mail:',
            phone: 'Telefone:',
            address: 'Endereço:',
            nationality: 'Nacionalidade:',
            linkedin: 'LinkedIn:',
            portfolio: 'Portfólio:',
            github: 'GitHub:',
            youtube: 'YouTube:',
            objective: 'Objetivo',
            experience: 'Experiência',
            education: 'Educação',
            languages: 'Idiomas',
            skills: 'Habilidades',
            present: 'Atualmente',
            months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        EN: {
            personalInfo: 'Personal Information',
            email: 'Email:',
            phone: 'Phone:',
            address: 'Address:',
            nationality: 'Nationality:',
            linkedin: 'LinkedIn:',
            portfolio: 'Portfolio:',
            github: 'GitHub:',
            youtube: 'YouTube:',
            objective: 'Objective',
            experience: 'Professional Experience',
            education: 'Education',
            languages: 'Languages',
            skills: 'Skills',
            present: 'Present',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        ES: {
            personalInfo: 'Datos Personales',
            email: 'Correo:',
            phone: 'Teléfono:',
            address: 'Dirección:',
            nationality: 'Nacionalidad:',
            linkedin: 'LinkedIn:',
            portfolio: 'Portafolio:',
            github: 'GitHub:',
            youtube: 'YouTube:',
            objective: 'Objetivo',
            experience: 'Experiencia Laboral',
            education: 'Educación',
            languages: 'Idiomas',
            skills: 'Habilidades',
            present: 'Actualidad',
            months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        }
    }[lang]

    // Helper to render date range
    const renderDateRange = (startDate, endDate, isCurrent) => {
        if (!startDate && !endDate) return ''

        const formatDate = (dateString) => {
            if (!dateString) return ''
            const months = t.months

            // Handle YYYY-MM (ISO)
            if (dateString.includes('-')) {
                const [year, month] = dateString.split('-')
                if (month && months[parseInt(month) - 1]) return `${months[parseInt(month) - 1]}/${year}`
                return dateString
            }

            // Handle MM/YYYY (Legacy)
            if (dateString.includes('/')) {
                const [month, year] = dateString.split('/')
                if (month && months[parseInt(month) - 1]) return `${months[parseInt(month) - 1]}/${year}`
                return dateString
            }

            return dateString
        }

        const start = formatDate(startDate)
        const end = isCurrent ? t.present : formatDate(endDate)
        return `${start} - ${end}`
    }

    // Helper for Rich Text line breaks
    const renderRichText = (text) => {
        if (!text) return null
        return text.split('\n').map((line, i) => {
            const processBold = (str) => {
                const parts = str.split(/(\*\*.*?\*\*)/g)
                return parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index}>{part.slice(2, -2)}</strong>
                    }
                    return part
                })
            }

            return (
                <React.Fragment key={i}>
                    {processBold(line)}
                    {i < text.split('\n').length - 1 && <br />}
                </React.Fragment>
            )
        })
    }

    return (
        <div id="resume-preview" className="bg-white mx-auto shadow-2xl relative" style={{ width: '210mm', minHeight: 'auto', padding: '0' }}>
            <div className="h-full w-full p-[56px] text-[#1e293b] font-sans text-left print:p-0">

                {/* HEADLINE */}
                <header className="mb-[50px] text-left border-b-4 border-[#1e3a8a] pb-6">
                    <h1 className="text-[32px] font-extrabold text-[#1e3a8a] uppercase tracking-wide leading-tight mb-2 font-['Inter']">
                        {resumeData.personalInfo.fullName || 'Seu Nome'}
                    </h1>
                    <p className="text-[14px] text-slate-500 font-medium tracking-widest uppercase">
                        {resumeData.personalInfo.role || 'Seu Cargo'}
                    </p>
                </header>

                <main className="grid grid-rows-[auto_1fr] gap-[40px]">

                    {/* INFO CONTACT */}
                    {(resumeData.personalInfo.email || resumeData.personalInfo.phone || resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio || resumeData.personalInfo.instagram || resumeData.personalInfo.youtube || resumeData.personalInfo.locations?.length > 0) && (
                        <section>
                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-[12px] border-b border-gray-100 pb-2">{t.personalInfo}</h3>
                            <div className="space-y-[6px] font-medium text-[11px] leading-relaxed">
                                {resumeData.personalInfo.email && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.email}</span>
                                        <span className="text-slate-600">{resumeData.personalInfo.email}</span>
                                    </div>
                                )}
                                {resumeData.personalInfo.phone && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.phone}</span>
                                        <span className="text-slate-600">{resumeData.personalInfo.phone}</span>
                                    </div>
                                )}
                                {resumeData.personalInfo.locations && resumeData.personalInfo.locations.length > 0 && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.address}</span>
                                        <span className="text-slate-600">
                                            {resumeData.personalInfo.locations.join(', ')} {resumeData.personalInfo.nationality && `- ${resumeData.personalInfo.nationality}`}
                                        </span>
                                    </div>
                                )}
                                {resumeData.personalInfo.nationality && !resumeData.personalInfo.locations?.length && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.nationality}</span>
                                        <span className="text-slate-600">{resumeData.personalInfo.nationality}</span>
                                    </div>
                                )}
                                {resumeData.personalInfo.linkedin && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.linkedin}</span>
                                        <span className="text-slate-600">{resumeData.personalInfo.linkedin}</span>
                                    </div>
                                )}
                                {resumeData.personalInfo.portfolio && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.portfolio}</span>
                                        <span className="text-slate-600">{resumeData.personalInfo.portfolio}</span>
                                    </div>
                                )}
                                {resumeData.personalInfo.github && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.github}</span>
                                        <span className="text-slate-600">{resumeData.personalInfo.github}</span>
                                    </div>
                                )}
                                {resumeData.personalInfo.youtube && (
                                    <div className="grid grid-cols-[170px_1fr] items-baseline">
                                        <span className="font-bold text-[#1e3a8a]">{t.youtube}</span>
                                        <span className="text-slate-600">{resumeData.personalInfo.youtube}</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* CONTENT BODY */}
                    <section className="space-y-[45px]">

                        {/* OBJETIVO */}
                        {resumeData.personalInfo.summary && (
                            <div>
                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-[15px] border-b border-gray-100 pb-2">{t.objective}</h3>
                                <div className="grid grid-cols-[170px_1fr]">
                                    {/* Empty Column for Indentation */}
                                    <div></div>
                                    <div className="text-[11px] text-slate-600 leading-relaxed text-justify">
                                        {renderRichText(resumeData.personalInfo.summary)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* EXPERIÊNCIA */}
                        {resumeData.experience.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-[25px] border-b border-gray-100 pb-2">{t.experience}</h3>
                                <div className="space-y-[40px]">
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} className="grid grid-cols-[170px_1fr] gap-6 experience-item">
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-[#4560b5] mb-1">{exp.location}</div>
                                                <div className="text-[10px] text-slate-400 italic">
                                                    {renderDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-extrabold text-[#1e3a8a] mb-0.5">{exp.position}</h4>
                                                <p className="text-[11px] font-bold text-slate-500 mb-[18px]">{exp.company}</p>
                                                <div className="text-[11px] text-slate-600 leading-relaxed text-justify">
                                                    {renderRichText(exp.description)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* EDUCAÇÃO */}
                        {resumeData.education.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-[25px] border-b border-gray-100 pb-2">{t.education}</h3>
                                <div className="space-y-[30px]">
                                    {resumeData.education.map((edu, i) => (
                                        <div key={i} className="grid grid-cols-[170px_1fr] gap-6 school-item">
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-[#4560b5] mb-1">{edu.location}</div>
                                                <div className="text-[10px] text-slate-400 italic">
                                                    {renderDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-extrabold text-[#1e3a8a] mb-0.5">{edu.degree}</h4>
                                                <p className="text-[11px] text-slate-500 font-medium">{edu.school}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SKILLS & IDIOMAS */}
                        {(resumeData.languages.length > 0 || resumeData.skills.length > 0) && (
                            <div className="grid grid-cols-[170px_1fr] gap-6 border-t border-gray-100 pt-[30px]">
                                <div className="text-right">
                                    {resumeData.languages.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">{t.languages}</h3>
                                            <div className="space-y-3">
                                                {resumeData.languages.map((lang, i) => (
                                                    <div key={i}>
                                                        <span className="text-[11px] font-bold text-[#2563eb] block mb-0.5">{lang.name}</span>
                                                        <span className="text-[10px] text-slate-500 block">{lang.level}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-16">
                                    {resumeData.skills.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">{t.skills}</h3>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-16">
                                                {resumeData.skills.map((skill, i) => (
                                                    <span key={i} className="text-[11px] font-bold text-[#2563eb] break-words">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    )
}

export default ResumePreview
