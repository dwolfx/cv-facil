
import { jsPDF } from 'jspdf'

export const generateClassicPDF = (resumeData) => {
    const doc = new jsPDF()
    doc.setFont("times", "bold")
    doc.text(resumeData.personalInfo.fullName || 'Currículo', 20, 20)
    doc.text("Template Clássico - Em Breve", 20, 30)
    doc.save('curriculo-classico.pdf')
}
