import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import UnsavedChangesModal from '../../components/UnsavedChangesModal'
import { Loader2 } from 'lucide-react'

// Hooks
import { useResume } from '../../hooks/useResume'
import { useUserPlan } from '../../hooks/useUserPlan'

// Components
import EditorHeader from './components/EditorHeader'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'

// Styles
import './Editor.css'

import Sidebar from '../../components/Sidebar'

import { supabase } from '../../services/supabaseClient'

const Editor = () => {
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const resumeId = searchParams.get('id')
    const [resumeCount, setResumeCount] = useState(0)

    // Custom Hooks
    const {
        resumeData,
        loading,
        submitting,
        strength,
        isDirty,
        blocker,
        handleSave,
        handleImportResume,
        handleExportPDF,
        updateField,
        updateArrayItem,
        addArrayItem,
        removeArrayItem
    } = useResume(user, resumeId)

    const { features: planFeatures } = useUserPlan(user)

    // Fetch Resume Count
    useEffect(() => {
        if (!user) return
        const fetchCount = async () => {
            const { count, error } = await supabase
                .from('resumes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)

            if (!error) setResumeCount(count || 0)
        }
        fetchCount()
    }, [user, submitting]) // Refetch when saving (creating new)

    // UI Local State
    const [activeSection, setActiveSection] = useState('personal')
    const [activeMobileTab, setActiveMobileTab] = useState('edit') // 'edit' | 'preview'
    const [zoom, setZoom] = useState(100)

    // Mobile Zoom adjustment
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                const idealZoom = Math.floor((window.innerWidth - 32) / 800 * 100)
                setZoom(Math.max(30, idealZoom))
            } else {
                setZoom(100)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleSection = (section) => setActiveSection(activeSection === section ? null : section)

    if (loading && !resumeData) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        )
    }

    return (
        <div className="h-screen w-full bg-slate-100 flex flex-row overflow-hidden font-sans">
            {/* Added Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <EditorHeader
                    planFeatures={planFeatures}
                    resumeCount={resumeCount}
                    handleSave={handleSave}
                    handleExportPDF={handleExportPDF}
                    handleImportResume={handleImportResume}
                    submitting={submitting}
                    loading={loading}
                    isDirty={isDirty}
                />

                <div className="flex-1 flex overflow-hidden relative">

                    {/* LEFT SIDEBAR (FORM) */}
                    <aside className={`
                        absolute md:relative z-20 w-full md:w-[450px] lg:w-[500px] h-full bg-white border-r border-gray-200 overflow-y-auto
                        transition-transform duration-300 ease-in-out
                        ${activeMobileTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}>
                        <ResumeForm
                            resumeData={resumeData}
                            activeSection={activeSection}
                            toggleSection={toggleSection}
                            updateField={updateField}
                            updateArrayItem={updateArrayItem}
                            addArrayItem={addArrayItem}
                            removeArrayItem={removeArrayItem}
                            strength={strength}
                        />
                    </aside>

                    {/* RIGHT SIDE (PREVIEW) */}
                    <main className={`
                        flex-1 h-full bg-slate-100 overflow-y-auto overflow-x-hidden relative
                        ${activeMobileTab === 'preview' ? 'block' : 'hidden md:block'}
                    `}>
                        <div className="min-h-full p-4 md:p-12 flex justify-center items-start">
                            <div
                                style={{
                                    transform: `scale(${zoom / 100})`,
                                    transformOrigin: 'top center',
                                    transition: 'transform 0.2s ease-out'
                                }}
                                className="bg-white shadow-xl min-h-[297mm]"
                            >
                                <ResumePreview resumeData={resumeData} />
                            </div>
                        </div>
                    </main>

                    {/* MOBILE TABS (Bottom Bar) */}
                    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-2xl rounded-full p-1.5 flex gap-1 border border-gray-200 z-50">
                        <button
                            onClick={() => setActiveMobileTab('edit')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeMobileTab === 'edit'
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => setActiveMobileTab('preview')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeMobileTab === 'preview'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            Visualizar
                        </button>
                    </div>

                </div>
            </div>

            {/* Unsaved Changes Modal */}
            {blocker.state === 'blocked' && (
                <UnsavedChangesModal
                    isOpen={true}
                    onCancel={() => blocker.reset()}
                    onConfirm={() => blocker.proceed()}
                    onSave={() => handleSave(true)}
                />
            )}
        </div>
    )
}

export default Editor
