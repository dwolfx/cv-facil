import React from 'react'
import './ClassicSidebar.css'

const ClassicSidebar = ({ data }) => {
    const { personalInfo, experience, education, skills, languages } = data

    return (
        <div className="cv-classic-sidebar">
            {/* Header */}
            <header className="cv-header-classic">
                <h1 className="cv-name-classic">{personalInfo.fullName || 'SEU NOME AQUI'}</h1>
                <h2 className="cv-role-classic">{personalInfo.role || 'Seu Cargo/Título Profissional'}</h2>
            </header>

            <div className="cv-body-classic">
                {/* Left Column (Sidebar) */}
                <aside className="cv-sidebar-left">
                    {/* Contact Info */}
                    <section className="cv-section-sidebar">
                        <h3 className="cv-title-sidebar">Informação de Contato</h3>
                        <ul className="cv-list-sidebar">
                            {personalInfo.email && <li><span className="cv-label">E-mail:</span> {personalInfo.email}</li>}
                            {personalInfo.phone && <li><span className="cv-label">Telefone:</span> {personalInfo.phone}</li>}
                            {personalInfo.location && <li><span className="cv-label">Endereço:</span> {personalInfo.location}</li>}
                            {personalInfo.linkedin && <li><span className="cv-label">LinkedIn:</span> {personalInfo.linkedin}</li>}
                            {personalInfo.website && <li><span className="cv-label">Site:</span> {personalInfo.website}</li>}
                        </ul>
                    </section>

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section className="cv-section-sidebar">
                            <h3 className="cv-title-sidebar">Educação</h3>
                            {education.map((edu, index) => (
                                <div key={index} className="cv-item-sidebar">
                                    <div className="cv-date-sidebar">{edu.period}</div>
                                    <div className="cv-main-sidebar">{edu.degree}</div>
                                    <div className="cv-sub-sidebar">{edu.school}</div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <section className="cv-section-sidebar">
                            <h3 className="cv-title-sidebar">Idiomas</h3>
                            {languages.map((lang, index) => (
                                <div key={index} className="cv-item-sidebar">
                                    <div className="cv-main-sidebar">{lang.name}</div>
                                    <div className="cv-sub-sidebar">{lang.level}</div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section className="cv-section-sidebar">
                            <h3 className="cv-title-sidebar">Habilidades</h3>
                            <div className="cv-skills-grid">
                                {skills.map((skill, index) => (
                                    <span key={index} className="cv-skill-tag">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                {/* Right Column (Main Content) */}
                <main className="cv-main-column">
                    {/* Objective/Summary */}
                    {personalInfo.summary && (
                        <section className="cv-section-main">
                            <h3 className="cv-title-main">Objetivo</h3>
                            <p className="cv-text-main">{personalInfo.summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    <section className="cv-section-main">
                        <h3 className="cv-title-main">Experiência</h3>
                        {experience && experience.length > 0 ? (
                            experience.map((exp, index) => (
                                <div key={index} className="cv-item-main">
                                    <div className="cv-item-header">
                                        <div className="cv-item-left">
                                            <span className="cv-date-main">{exp.period}</span>
                                            <span className="cv-location-main">{exp.location}</span>
                                        </div>
                                        <div className="cv-item-right">
                                            <h4 className="cv-job-title">{exp.position}</h4>
                                            <div className="cv-company">{exp.company}</div>
                                        </div>
                                    </div>
                                    <div className="cv-description">
                                        <p>{exp.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State Placeholder for design review */
                            <div className="cv-item-main placeholder">
                                <div className="cv-item-header">
                                    <div className="cv-item-left">
                                        <span className="cv-date-main">Jan 2023 - Atual</span>
                                    </div>
                                    <div className="cv-item-right">
                                        <h4 className="cv-job-title">Cargo Exemplo</h4>
                                        <div className="cv-company">Nome da Empresa</div>
                                    </div>
                                </div>
                                <div className="cv-description">
                                    <p>Descreva suas responsabilidades e conquistas aqui...</p>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    )
}

export default ClassicSidebar
