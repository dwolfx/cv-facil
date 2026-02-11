
import { jsPDF } from 'jspdf'

export const generateMinimalistPDF = (resumeData) => {
    const doc = new jsPDF()
    doc.setFont("helvetica", "normal")
    doc.text(resumeData.personalInfo.fullName || 'Currículo', 105, 20, { align: 'center' })
    doc.text("Template Minimalista - Em Breve", 105, 30, { align: 'center' })
    doc.save('curriculo-minimalista.pdf')
}
