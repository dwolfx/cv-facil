
import React, { useRef, useState, useEffect } from 'react'
import { Save, Download, UploadCloud, Loader2, Menu, X } from 'lucide-react'
import Header from '../../../components/Header'
import UserDropdown from '../../../components/UserDropdown'

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
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    const onFileChange = (e) => {
        handleImportResume(e.target.files[0])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Close dropdown on outside click
    useEffect(() => {
        if (!menuOpen) return
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [menuOpen])

    const actionImport = () => { fileInputRef.current?.click(); setMenuOpen(false) }
    const actionDownload = () => { handleExportPDF(); setMenuOpen(false) }
    const actionSave = () => { handleSave(false); setMenuOpen(false) }

    return (
        <>
            <input
                type="file"
                accept=".pdf,.docx,.txt"
                ref={fileInputRef}
                className="hidden"
                onChange={onFileChange}
            />

            {/* ── Mobile Header ── */}
            <header className="md:hidden flex items-center justify-between bg-white/80 backdrop-blur-md px-4 h-16 border-b border-slate-200 shrink-0 relative" style={{ zIndex: 30 }}>
                {/* Left: Hamburger + Title together */}
                <div className="flex items-center gap-2 relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <span className="font-bold text-slate-800 text-base">Editor</span>

                    {menuOpen && (
                        <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[190px] animate-in fade-in slide-in-from-top-2 duration-150" style={{ zIndex: 60 }}>
                            <button
                                onClick={actionImport}
                                disabled={loading}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left"
                            >
                                <UploadCloud size={16} className="text-slate-400" />
                                Importar
                            </button>
                            <button
                                onClick={actionDownload}
                                disabled={loading}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left"
                            >
                                <Download size={16} className="text-orange-500" />
                                Baixar PDF
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                                onClick={actionSave}
                                disabled={submitting || loading || !isDirty}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
                            >
                                {submitting
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : <Save size={16} />
                                }
                                Salvar
                                {isDirty && !submitting && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: User */}
                <UserDropdown />
            </header>

            {/* ── Desktop Header ── */}
            <div className="hidden md:block">
                <Header
                    title="Editor"
                    subtitle="Edite as informações e acompanhe o resultado em tempo real."
                    planCurrent={resumeCount}
                    planMax={planFeatures?.maxResumes || 2}
                    isPremium={planFeatures?.isPremium}
                    planTier={planFeatures?.tier}
                    planExpiresAt={planFeatures?.expiresAt}
                    className="sticky top-0 z-30 shadow-sm"
                >
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] hover:bg-orange-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-orange-100"
                        title="Importar Currículo"
                    >
                        <UploadCloud size={16} />
                        <span>Importar</span>
                    </button>

                    <button
                        onClick={handleExportPDF}
                        disabled={loading}
                        className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                    >
                        <Download size={14} />
                        <span>Baixar PDF</span>
                    </button>

                    <div className="h-6 w-px bg-slate-200 mx-1"></div>

                    <button
                        onClick={() => handleSave(false)}
                        disabled={submitting || loading || !isDirty}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        <span>Salvar</span>
                    </button>
                </Header>
            </div>
        </>
    )
}

export default EditorHeader
