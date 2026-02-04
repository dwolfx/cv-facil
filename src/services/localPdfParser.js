
import * as pdfjsLib from 'pdfjs-dist';

// Configure Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const parseResume = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        let fullText = '';

        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return extractDataFromText(fullText);
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Falha ao ler o PDF. Verifique se o arquivo não está corrompido.");
    }
};

const extractDataFromText = (text) => {
    // Normalize text
    const cleanedText = text.replace(/\s+/g, ' ').trim();

    // Basic Heuristics (Regex)
    // This is a "Naive" parser. It looks for keywords to guess sections.

    const sections = {
        personalInfo: { fullName: '', email: '', phone: '', location: '', summary: '' },
        experience: [],
        education: [],
        skills: []
    };

    // 1. Extract Email
    const emailMatch = cleanedText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) sections.personalInfo.email = emailMatch[0];

    // 2. Extract Phone (Simple Brazil/Generic format)
    const phoneMatch = cleanedText.match(/(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/);
    if (phoneMatch) sections.personalInfo.phone = phoneMatch[0];

    // 3. Try to guess Name (First few words before any contact info)
    // This is tricky. Taking the first 3-4 words usually works for headlines.
    const nameProposal = cleanedText.split(' ').slice(0, 4).join(' ');
    sections.personalInfo.fullName = nameProposal;

    // 4. Extract "Experience" / "Experiência"
    // We look for the keyword and take a chunk of text until the next section
    const experienceRegex = /(Experiência|Experience|Work History)([\s\S]*?)(Educação|Education|Formação|Skills|Habilidades|$)/i;
    const experienceMatch = text.match(experienceRegex);

    if (experienceMatch && experienceMatch[2]) {
        // Naive split by newlines to guess items
        // In a real generic parser, we would need AI. Here we return a single block if we can't split.
        sections.experience.push({
            company: 'Detectada no PDF (Editar)',
            position: 'Cargo Detectado',
            description: experienceMatch[2].substring(0, 500).trim() // Limit size
        });
    }

    // 5. Extract "Education" / "Educação"
    const educationRegex = /(Educação|Education|Formação|Academic)([\s\S]*?)(Skills|Habilidades|Idiomas|Languages|$)/i;
    const educationMatch = text.match(educationRegex);

    if (educationMatch && educationMatch[2]) {
        sections.education.push({
            school: 'Instituição Detectada',
            degree: educationMatch[2].substring(0, 200).trim(),
            period: ''
        });
    }

    // 6. Extract Skills
    const skillsRegex = /(Skills|Habilidades|Competências)([\s\S]*?)(Idiomas|Languages|$)/i;
    const skillsMatch = text.match(skillsRegex);

    if (skillsMatch && skillsMatch[2]) {
        const rawSkills = skillsMatch[2].split(/[,•\n]/).map(s => s.trim()).filter(s => s.length > 2);
        sections.skills = rawSkills.slice(0, 10); // Take top 10
    }

    return sections;
};
