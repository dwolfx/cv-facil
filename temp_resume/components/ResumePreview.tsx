
import React from 'react';
import { ResumeData } from '../types';

interface Props {
  data: ResumeData;
  photoUrl?: string | null;
  language?: string;
}

const getLabels = (lang: string) => {
  switch (lang) {
    case 'Inglês':
      return { contact: 'Contact Info', objective: 'Objective', experience: 'Experience', education: 'Education', skills: 'Skills', current: 'Present' };
    case 'Espanhol':
      return { contact: 'Contacto', objective: 'Objetivo', experience: 'Experiencia', education: 'Educación', skills: 'Habilidades', current: 'Actualidad' };
    case 'Francês':
      return { contact: 'Contact', objective: 'Objectif', experience: 'Expérience', education: 'Éducation', skills: 'Compétences', current: 'Présent' };
    case 'Italiano':
      return { contact: 'Contatto', objective: 'Obiettivo', experience: 'Esperienza', education: 'Istruzione', skills: 'Competenze', current: 'Presente' };
    case 'Alemão':
      return { contact: 'Kontakt', objective: 'Zielsetzung', experience: 'Erfahrung', education: 'Bildung', skills: 'Fähigkeiten', current: 'Gegenwart' };
    case 'Mandarim':
      return { contact: '联系方式', objective: '职业目标', experience: '工作经验', education: '教育背景', skills: '技能', current: '至今' };
    default:
      return { contact: 'Informação de Contato', objective: 'Objetivo', experience: 'Experiência', education: 'Educação', skills: 'Habilidades', current: 'Atual' };
  }
};

export const ResumePreview: React.FC<Props> = ({ data, photoUrl, language = 'Português (BR)' }) => {
  const { fullName, email, phone, location, linkedin, website, summary, experiences, education, skills } = data;
  const navyColor = '#2D3E8B'; 
  const labels = getLabels(language);

  return (
    <div className="w-full flex justify-center bg-gray-300 p-4 overflow-x-auto">
      <div 
        className="bg-white shadow-2xl p-[20mm] w-[210mm] min-h-[297mm] text-gray-800 font-sans relative flex flex-col"
        id="resume-content"
        style={{ 
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          color: '#333'
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10 pl-[180px]">
          <header className="flex-grow">
            <h1 className="text-4xl font-extrabold mb-1 tracking-tight leading-tight" style={{ color: navyColor }}>
              {fullName || ''}
            </h1>
            <p className="text-xl font-bold" style={{ color: navyColor }}>
              {experiences[0]?.position || ''}
            </p>
          </header>
          {photoUrl && (
            <div className="ml-4 flex-shrink-0">
              <img src={photoUrl} alt="Profile" className="w-28 h-28 object-cover rounded-lg border-2 border-gray-100 shadow-sm" />
            </div>
          )}
        </div>

        {/* Contact Info */}
        <section className="flex mb-8 mt-[10px] break-inside-avoid">
          <div className="w-[160px] flex-shrink-0 mr-5 text-right pt-[30px]">
            <h3 className="text-xs font-bold uppercase tracking-widest leading-tight" style={{ color: navyColor }}>{labels.contact}</h3>
          </div>
          <div className="flex-grow text-xs space-y-1 border-l border-gray-100 pl-5 pt-[30px]">
            {email && <p><span className="font-bold" style={{ color: navyColor }}>E-mail:</span> {email}</p>}
            {location && <p><span className="font-bold" style={{ color: navyColor }}>{language === 'Português (BR)' ? 'Endereço' : 'Location'}:</span> {location}</p>}
            {phone && <p><span className="font-bold" style={{ color: navyColor }}>{language === 'Português (BR)' ? 'Telefone' : 'Phone'}:</span> {phone}</p>}
            {(linkedin || website) && <p><span className="font-bold" style={{ color: navyColor }}>Social:</span> {linkedin || website}</p>}
          </div>
        </section>

        {/* Objective */}
        {summary && (
          <section className="flex mb-8 mt-[10px] break-inside-avoid">
            <div className="w-[160px] flex-shrink-0 mr-5 text-right pt-[30px]">
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: navyColor }}>{labels.objective}</h3>
            </div>
            <div className="flex-grow text-[11px] leading-relaxed text-gray-700 whitespace-pre-wrap border-l border-gray-100 pl-5 pt-[30px]">
              {summary}
            </div>
          </section>
        )}

        {summary && <div className="mb-8 border-b border-gray-200 ml-[180px]" />}

        {/* Experience Section */}
        <section className="flex mb-8 mt-[10px]">
          <div className="w-[160px] flex-shrink-0 mr-5 text-right pt-[30px]">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: navyColor }}>{labels.experience}</h3>
          </div>
          <div className="flex-grow space-y-10 border-l border-gray-100 pl-5 pt-[30px]">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative mb-6 break-inside-avoid">
                <div className="absolute -left-[195px] top-0 w-[160px] text-right">
                   <p className="text-[10px] font-bold text-blue-500 leading-tight mb-1">{exp.location}</p>
                   <p className="text-[10px] italic text-blue-400">{exp.startDate} - {exp.endDate || labels.current}</p>
                </div>
                <h4 className="font-bold text-sm leading-tight mb-1" style={{ color: navyColor }}>{exp.position}</h4>
                <p className="text-xs font-bold text-gray-500 mb-2">{exp.company}</p>
                <div className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        {education.length > 0 && (
          <section className="flex mb-8 mt-[10px]">
            <div className="w-[160px] flex-shrink-0 mr-5 text-right pt-[30px]">
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: navyColor }}>{labels.education}</h3>
            </div>
            <div className="flex-grow space-y-8 border-l border-gray-100 pl-5 pt-[30px]">
              {education.map((edu, idx) => (
                <div key={idx} className="relative break-inside-avoid mb-4">
                  <div className="absolute -left-[195px] top-0 w-[160px] text-right">
                     <p className="text-[10px] font-bold text-blue-500 mb-1">{edu.location}</p>
                     <p className="text-[10px] italic text-blue-400">{edu.graduationDate}</p>
                  </div>
                  <h4 className="font-bold text-sm" style={{ color: navyColor }}>{edu.degree}</h4>
                  <p className="text-xs text-gray-600 font-medium">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="flex mb-8 mt-[10px] break-inside-avoid">
            <div className="w-[160px] flex-shrink-0 mr-5 text-right pt-[30px]">
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: navyColor }}>{labels.skills}</h3>
            </div>
            <div className="flex-grow border-l border-gray-100 pl-5 pt-[30px]">
              <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                {skills.map((skill, idx) => (
                  <div key={idx} className="text-[11px] text-blue-600 font-medium">• {skill}</div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
