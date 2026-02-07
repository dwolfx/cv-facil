
import React from 'react'

const ResumePreview = ({ resumeData }) => {
    // Helper to render date range (logic copied from original)
    const renderDateRange = (startDate, endDate, isCurrent) => {
        if (!startDate && !endDate) return ''
        const start = startDate ? startDate : ''
        const end = isCurrent ? 'Atualmente' : (endDate ? endDate : '')
        return `${start} - ${end}`
    }

    // Helper for Rich Text line breaks
    const renderRichText = (text) => {
        if (!text) return null
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ))
    }

    return (
        <div id="resume-preview" className="bg-white mx-auto shadow-2xl relative" style={{ width: '210mm', minHeight: '297mm', padding: '0' }}>
            <div className="h-full w-full p-[40px] text-[#1e293b] font-sans text-left print:p-0">

                {/* HEADLINE */}
                <header className="mb-10 text-left border-b-4 border-[#1e3a8a] pb-6">
                    <h1 className="text-[32px] font-extrabold text-[#1e3a8a] uppercase tracking-wide leading-tight mb-1 font-['Inter']">
                        {resumeData.personalInfo.fullName || 'Seu Nome'}
                    </h1>
                    <p className="text-[14px] text-slate-500 font-medium tracking-widest uppercase">
                        {resumeData.personalInfo.role || 'Seu Cargo'}
                    </p>
                </header>

                <main className="grid grid-rows-[auto_1fr] gap-8">

                    {/* INFO CONTACT */}
                    {(resumeData.personalInfo.email || resumeData.personalInfo.phone || resumeData.personalInfo.linkedin || resumeData.personalInfo.locations?.length > 0) && (
                        <section>
                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Informação de Contato</h3>
                            <div className="text-[11px] leading-relaxed text-slate-600 space-y-0.5 font-medium">
                                {resumeData.personalInfo.email && <div><span className="font-bold text-[#1e3a8a]">E-mail:</span> {resumeData.personalInfo.email}</div>}
                                {resumeData.personalInfo.locations && resumeData.personalInfo.locations.length > 0 && (
                                    <div><span className="font-bold text-[#1e3a8a]">Endereço:</span> {resumeData.personalInfo.locations.join(', ')} {resumeData.personalInfo.nationality && `- ${resumeData.personalInfo.nationality}`}</div>
                                )}
                                {resumeData.personalInfo.phone && <div><span className="font-bold text-[#1e3a8a]">Telefone:</span> {resumeData.personalInfo.phone}</div>}
                                {resumeData.personalInfo.nationality && !resumeData.personalInfo.locations?.length && (
                                    <div><span className="font-bold text-[#1e3a8a]">Nacionalidade:</span> {resumeData.personalInfo.nationality}</div>
                                )}
                                {resumeData.personalInfo.linkedin && (
                                    <div><span className="font-bold text-[#1e3a8a]">Redes sociais, site:</span> {resumeData.personalInfo.linkedin}</div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* CONTENT BODY */}
                    <section className="space-y-8">

                        {/* OBJETIVO */}
                        {resumeData.personalInfo.summary && (
                            <div>
                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Objetivo</h3>
                                <div className="text-[11px] text-slate-600 leading-relaxed text-justify">
                                    {renderRichText(resumeData.personalInfo.summary)}
                                </div>
                            </div>
                        )}

                        {/* EXPERIÊNCIA */}
                        {resumeData.experience.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Experiência</h3>
                                <div className="space-y-6">
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} className="grid grid-cols-[140px_1fr] gap-6 experience-item">
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-[#4560b5] mb-1">{exp.location}</div>
                                                <div className="text-[10px] text-slate-400 italic">
                                                    {renderDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-extrabold text-[#1e3a8a] mb-0.5">{exp.position}</h4>
                                                <p className="text-[11px] font-bold text-slate-500 mb-2">{exp.company}</p>
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
                                <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Educação</h3>
                                <div className="space-y-5">
                                    {resumeData.education.map((edu, i) => (
                                        <div key={i} className="grid grid-cols-[140px_1fr] gap-6 school-item">
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
                            <div className="grid grid-cols-[140px_1fr] gap-6 border-t border-gray-100 pt-6">
                                <div className="text-right">
                                    {resumeData.languages.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">Idiomas</h3>
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
                                            <h3 className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-widest mb-4">Habilidades</h3>
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
