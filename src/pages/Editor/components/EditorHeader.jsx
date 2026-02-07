
import React, { useRef } from 'react'
import { Save, Download, UploadCloud, Loader2 } from 'lucide-react'
// PlanWidget removed as it is handled by Header
import Header from '../../../components/Header'

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
        <Header
            title="Editor"
            subtitle="Edite as informações e acompanhe o resultado em tempo real."
            planCurrent={resumeCount}
            planMax={planFeatures?.maxResumes || 2}
            isPremium={planFeatures?.isPremium}
            className="sticky top-0 z-30 shadow-sm"
        >
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

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

            <button
                onClick={() => handleSave(false)}
                disabled={submitting || loading || !isDirty}
                className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span className="hidden md:inline">Salvar</span>
            </button>
        </Header>
    )
}

export default EditorHeader
