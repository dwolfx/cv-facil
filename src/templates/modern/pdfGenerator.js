
import { getTemplate } from '../templates/registry'

export const generateResumePDF = (resumeData) => {
    constMN templateId = resumeData.template_id || 'modern'
    const template = getTemplate(templateId)

    if (template && template.pdfGenerator) {
        return template.pdfGenerator(resumeData)
    } else {
        console.error("Template generator not found for:", templateId)
    }
}
