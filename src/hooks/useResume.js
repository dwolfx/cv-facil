import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useBlocker } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { toast } from 'sonner'
import { parseResume } from '../services/localPdfParser'
import { generateResumePDF } from '../utils/pdfGenerator'

const initialResumeState = {
    personalInfo: {
        fullName: '',
        role: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        instagram: '',
        youtube: '',
        locations: [],
        nationality: '',
        summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: []
}

export const useResume = (user, resumeId) => {
    const navigate = useNavigate()
    const [resumeData, setResumeData] = useState(initialResumeState)
    const [lastSavedData, setLastSavedData] = useState(initialResumeState)
    const [loading, setLoading] = useState(!!resumeId)
    const [submitting, setSubmitting] = useState(false)
    const [strength, setStrength] = useState(0)

    const skipNextFetch = React.useRef(false)

    // Dirty Check
    const isDirty = useMemo(() => {
        return JSON.stringify(resumeData) !== JSON.stringify(lastSavedData)
    }, [resumeData, lastSavedData])

    // Calculate Strength
    useEffect(() => {
        let score = 0
        if (resumeData.personalInfo.fullName) score += 10
        if (resumeData.personalInfo.role) score += 10
        if (resumeData.personalInfo.summary) score += 15
        if (resumeData.experience.length > 0) score += 25
        if (resumeData.education.length > 0) score += 15
        if (resumeData.skills.length > 0) score += 15
        if (resumeData.personalInfo.email) score += 5
        if (resumeData.languages.length > 0) score += 5
        setStrength(Math.min(score, 100))
    }, [resumeData])



    // Fetch Resume
    useEffect(() => {
        if (resumeId && user) {

            // Optimization: If we just created this resume locally, don't re-fetch immediately
            if (skipNextFetch.current) {
                skipNextFetch.current = false
                setLoading(false)
                return
            }

            setLoading(true)
            const fetchResume = async () => {
                try {
                    const { data, error } = await supabase
                        .from('resumes')
                        .select('*')
                        .eq('id', resumeId)
                        .single()

                    if (error) throw error
                    if (data && data.content) {
                        const mergedContent = {
                            ...initialResumeState,
                            ...data.content,
                            personalInfo: {
                                ...initialResumeState.personalInfo,
                                ...(data.content.personalInfo || {})
                            }
                        }
                        setResumeData(mergedContent)
                        setLastSavedData(mergedContent)
                    }
                } catch (error) {
                    console.error('Error fetching resume:', error)
                    toast.error('Erro ao carregar currículo.')
                    navigate('/dashboard')
                } finally {
                    setLoading(false)
                }
            }
            fetchResume()
        } else {
            setLoading(false)
        }
    }, [resumeId, user, navigate])



    // Navigation Blocker
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname && !!resumeId // Only block if saved at least once (has ID)
    )

    // Before Unload Warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isDirty])

    // Actions
    const handleSave = async (andProceed = false, isAutoSave = false) => {
        if (!user) return
        setSubmitting(true)

        try {
            const resumeToSave = {
                user_id: user.id,
                title: resumeData.personalInfo.role || 'Sem Título',
                content: resumeData,
                strength: strength,
                updated_at: new Date()
            }

            let error, data

            if (resumeId) {
                const res = await supabase.from('resumes').update(resumeToSave).eq('id', resumeId).select()
                error = res.error
                data = res.data
            } else {
                const res = await supabase.from('resumes').insert(resumeToSave).select()
                error = res.error
                data = res.data
            }

            if (error) throw error

            if (!isAutoSave) toast.success('Currículo salvo com sucesso!')
            setLastSavedData(resumeData)

            if (andProceed && blocker.state === 'blocked') {
                blocker.proceed()
            } else if (!resumeId && data && data[0]) {
                // If we just created it, set flag to skip the next fetch (since we have the data)
                skipNextFetch.current = true
                navigate(`/editor?id=${data[0].id}`, { replace: true })
            }
        } catch (error) {
            console.error('Error saving resume:', error)
            toast.error('Erro ao salvar currículo.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleImportResume = async (file) => {
        if (!file) return
        const toastId = toast.loading('Lendo currículo...')
        try {
            const parsedData = await parseResume(file)
            setResumeData(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    ...parsedData.personalInfo,
                },
                experience: parsedData.experience.map((exp, i) => ({
                    id: Date.now() + i,
                    ...exp,
                    startDate: exp.startDate || '',
                    endDate: exp.endDate || '',
                    isCurrent: exp.isCurrent || false,
                    location: exp.location || ''
                })),
                education: parsedData.education.map((edu, i) => ({
                    id: Date.now() + i + 100,
                    ...edu,
                    startDate: edu.startDate || '',
                    endDate: edu.endDate || '',
                    isCurrent: false,
                    location: ''
                })),
                skills: parsedData.skills.length > 0 ? parsedData.skills : prev.skills,
                languages: parsedData.languages.length > 0 ? parsedData.languages : prev.languages
            }))
            toast.success('Currículo importado!', { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Erro importação', { id: toastId })
        }
    }

    const handleExportPDF = () => {
        const toastId = toast.loading('Gerando PDF...')
        try {
            generateResumePDF(resumeData)
            toast.success('Download iniciado!', { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error('Erro ao gerar PDF', { id: toastId })
        }
    }

    // State Setters (Helpers)
    const updateField = (section, field, value) => {
        setResumeData(prev => {
            if (section === 'personalInfo') {
                return { ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }
            }
            return { ...prev, [section]: { ...prev[section], [field]: value } }
        })
    }

    const updateArrayItem = (section, index, field, value) => {
        setResumeData(prev => {
            const newArray = [...prev[section]]
            newArray[index] = { ...newArray[index], [field]: value }
            return { ...prev, [section]: newArray }
        })
    }

    const addArrayItem = (section, item) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], item]
        }))
    }

    const removeArrayItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }))
    }

    return {
        resumeData,
        setResumeData, // Exposed if needed for complex updates not covered helpers
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
    }
}
