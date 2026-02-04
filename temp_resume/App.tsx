
import React, { useState, useRef } from 'react';
import { ResumeData, Experience, Education } from './types';
import { InputSection } from './components/InputSection';
import { ResumePreview } from './components/ResumePreview';
import { optimizeSummary, optimizeDescription, translateResume, extractFromImage } from './geminiService';

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState('Português (BR)');
  
  const [data, setData] = useState<ResumeData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    experiences: [],
    education: [],
    skills: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setShowPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const extracted = await extractFromImage(base64, file.type);
        if (extracted) {
          setData(prev => ({ ...prev, ...extracted }));
          alert("Currículo importado com sucesso!");
        }
      } catch (error) {
        console.error("Erro na extração:", error);
        alert("Não foi possível ler o arquivo. Tente um PDF ou Imagem com texto nítido.");
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTranslate = async (lang: string) => {
    if (lang === currentLang || (!data.fullName && !data.summary)) {
        if (lang !== currentLang) setCurrentLang(lang);
        return;
    };
    setLoading(true);
    try {
      const translated = await translateResume(data, lang);
      setData(translated);
      setCurrentLang(lang);
    } catch (error) {
      alert("Erro na tradução.");
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: '', position: '', location: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExps = [...data.experiences];
    newExps[index][field] = value;
    setData(prev => ({ ...prev, experiences: newExps }));
  };

  const removeExperience = (index: number) => {
    setData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', location: '', graduationDate: '' }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...data.education];
    newEdu[index][field] = value;
    setData(prev => ({ ...prev, education: newEdu }));
  };

  const removeEducation = (index: number) => {
    setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s !== "");
    setData(prev => ({ ...prev, skills }));
  };

  const downloadPDF = () => {
    const element = document.getElementById('resume-content');
    if (!element) return;
    
    const opt = {
      margin: 0,
      filename: `${data.fullName.replace(/\s+/g, '_') || 'curriculo'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        scrollY: 0
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        precision: 16
      },
      pagebreak: { mode: ['css', 'legacy'], avoid: '.break-inside-avoid' }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-blue-900">IA Processando...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-4 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1">AI Resume Builder</h1>
          <p className="text-gray-500 text-sm">Design profissional padrão Recrutador / ATS.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,image/*" />
          <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
            <i className="fas fa-file-import"></i> {loading ? 'Carregando...' : 'Importar Currículo Existente'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6 max-h-[1200px] overflow-y-auto pr-2 pb-10 custom-scrollbar">
          
          <InputSection title="Foto do Perfil" icon="fa-camera">
            <div className="flex items-center gap-6 p-4 border border-dashed rounded-xl bg-blue-50/50">
              <input type="file" onChange={handlePhotoUpload} className="text-xs w-full" accept="image/*" />
              <label className="flex items-center gap-2 text-sm cursor-pointer font-bold whitespace-nowrap">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={showPhoto} onChange={e => setShowPhoto(e.target.checked)} />
                Exibir foto
              </label>
            </div>
          </InputSection>

          <InputSection title="Dados Pessoais" icon="fa-user">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Nome Completo" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleInputChange} value={data.fullName} />
              <input name="email" placeholder="E-mail" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleInputChange} value={data.email} />
              <input name="phone" placeholder="Telefone" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleInputChange} value={data.phone} />
              <input name="location" placeholder="Cidade / Estado" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleInputChange} value={data.location} />
              <input name="linkedin" placeholder="LinkedIn / Site" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2" onChange={handleInputChange} value={data.linkedin} />
            </div>
          </InputSection>

          <InputSection title="Resumo Profissional" icon="fa-bullseye">
            <textarea name="summary" className="p-3 border rounded-lg w-full h-32 mb-2 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleInputChange} value={data.summary} />
            <button onClick={() => optimizeSummary(data.summary).then(res => setData(d => ({...d, summary: res})))} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <i className="fas fa-magic"></i> Melhorar com IA
            </button>
          </InputSection>

          <InputSection title="Experiências Profissionais" icon="fa-briefcase">
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="p-4 border rounded-xl mb-4 bg-white shadow-sm relative group">
                <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input placeholder="Cargo" className="p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500" value={exp.position} onChange={(e) => updateExperience(idx, 'position', e.target.value)} />
                  <input placeholder="Empresa" className="p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                  <input placeholder="Local (ex: São Paulo, Brasil)" className="p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500" value={exp.location} onChange={(e) => updateExperience(idx, 'location', e.target.value)} />
                  <div className="flex gap-2">
                    <input placeholder="Início" className="p-2 border rounded text-sm w-1/2 focus:ring-1 focus:ring-blue-500" value={exp.startDate} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} />
                    <input placeholder="Fim" className="p-2 border rounded text-sm w-1/2 focus:ring-1 focus:ring-blue-500" value={exp.endDate} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} />
                  </div>
                </div>
                <textarea placeholder="Descrição das responsabilidades..." className="p-2 border rounded w-full h-24 text-sm focus:ring-1 focus:ring-blue-500" value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} />
                <button onClick={() => optimizeDescription(exp.description).then(res => updateExperience(idx, 'description', res))} className="text-[10px] font-bold text-blue-600 mt-2 block">
                  Otimizar Bullet Points com IA
                </button>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all font-bold">+ Adicionar Experiência</button>
          </InputSection>

          <InputSection title="Educação" icon="fa-graduation-cap">
            {data.education.map((edu, idx) => (
              <div key={idx} className="p-4 border rounded-xl mb-4 bg-white shadow-sm relative">
                <button onClick={() => removeEducation(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="Curso" className="p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} />
                  <input placeholder="Instituição" className="p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500" value={edu.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} />
                  <input placeholder="Local" className="p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500" value={edu.location} onChange={(e) => updateEducation(idx, 'location', e.target.value)} />
                  <input placeholder="Data (ex: 2010 - 2014)" className="p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500" value={edu.graduationDate} onChange={(e) => updateEducation(idx, 'graduationDate', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all font-bold">+ Adicionar Formação</button>
          </InputSection>

          <InputSection title="Habilidades" icon="fa-check-circle">
             <input placeholder="Design System, React, UX, Inglês..." className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleSkillsChange} value={data.skills.join(', ')} />
             <p className="text-[10px] text-gray-400 mt-2">Separe por vírgulas.</p>
          </InputSection>

          <InputSection title="Tradução Profissional" icon="fa-language">
            <p className="text-xs text-gray-500 mb-4">Selecione o idioma para traduzir o currículo inteiro:</p>
            <div className="flex flex-wrap gap-2">
              {['Português (BR)', 'Inglês', 'Espanhol', 'Francês', 'Italiano', 'Alemão', 'Mandarim'].map(lang => (
                <button 
                  key={lang} 
                  onClick={() => handleTranslate(lang)} 
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${currentLang === lang ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:border-blue-400'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </InputSection>

          <div className="pt-4 pb-12">
            <button onClick={downloadPDF} className="w-full bg-blue-700 text-white py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-blue-800 hover:-translate-y-1 transform transition-all flex items-center justify-center gap-4">
              <i className="fas fa-file-pdf"></i> BAIXAR CURRÍCULO (A4 PDF)
            </button>
          </div>
        </div>

        <div className="sticky top-8 bg-gray-200 rounded-2xl p-4 shadow-inner flex justify-center">
          <div className="w-full max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
            <ResumePreview data={data} photoUrl={showPhoto ? photoUrl : null} language={currentLang} />
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default App;
