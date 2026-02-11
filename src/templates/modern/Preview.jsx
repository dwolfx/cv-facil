
import React from 'react'
import { getTemplate } from '../../../templates/registry'

const ResumePreview = ({ resumeData }) => {
    // Default to 'modern' if no template selected (or if data structure is old)
    const templateId = resumeData.template_id || 'modern'
    const template = getTemplate(templateId)
    const TemplateComponent = template.component

    return <TemplateComponent resumeData={resumeData} />
}

export default ResumePreview
