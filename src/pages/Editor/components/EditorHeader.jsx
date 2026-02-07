
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Save, Download, UploadCloud, ChevronLeft, Loader2 } from 'lucide-react'
import PlanWidget from '../../../components/PlanWidget'

const EditorHeader = ({
    planFeatures,
    resumeCount = 0,
    handleSave,
    handleExportPDF,
    handleImportResume,
    submitting,
    loading,
    isDirty
}) => {
    const fileInputRef = useRef(null)

    const onFileChange = (e) => {
        handleImportResume(e.target.files[0])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-bold text-slate-800 text-lg leading-tight">Editor</h1>
                    <p className="text-xs text-slate-500 hidden md:block">Edite as informações e acompanhe o resultado em tempo real.</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <PlanWidget current={resumeCount} max={planFeatures?.maxResumes || 2} />

                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileChange}
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] hover:bg-orange-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-orange-100"
                    title="Importar Currículo"
                >
                    <UploadCloud size={16} />
                    <span className="hidden md:inline">Importar</span>
                </button>

                <button
                    onClick={handleExportPDF}
                    disabled={loading}
                    className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                >
                    <Download size={14} />
                    <span className="hidden md:inline">Baixar PDF</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button
                    onClick={() => handleSave(false)}
                    disabled={submitting || loading || !isDirty}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span className="hidden md:inline">Salvar</span>
                </button>
            </div>
        </header>
    )
}

export default EditorHeader
