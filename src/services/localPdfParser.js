
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const parseResume = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
        if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            return await parsePdf(file);
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.docx')
        ) {
            return await parseDocx(file);
        } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
            return await parseTxt(file);
        } else {
            throw new Error(`Formato de arquivo não suportado: ${fileType || fileName}`);
        }
    } catch (error) {
        console.error("Resume Parsing Error:", error);
        throw new Error("Falha ao ler o arquivo. Verifique se não está corrompido.");
    }
};

const parsePdf = async (file) => {
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
};

const parseDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return extractDataFromText(result.value);
};

const parseTxt = async (file) => {
    const text = await file.text();
    return extractDataFromText(text);
};

const extractDataFromText = (text) => {
    // Normalize text (preserve lines for some parsing, but clean excessive spaces)
    // We keep lines to help with item detection
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ');
    const cleanedGlobal = normalizedText.replace(/\s+/g, ' ').trim();

    const sections = {
        personalInfo: { fullName: '', email: '', phone: '', location: '', summary: '', linkedin: '', nationality: '' },
        experience: [],
        education: [],
        skills: [],
        languages: []
    };

    // --- 1. Global Extractors (Email, Phone, LinkedIn) ---
    const emailMatch = cleanedGlobal.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) sections.personalInfo.email = emailMatch[0];

    const phoneMatch = cleanedGlobal.match(/(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/);
    if (phoneMatch) sections.personalInfo.phone = phoneMatch[0];

    // LinkedIn
    const linkedinMatch = cleanedGlobal.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) sections.personalInfo.linkedin = `https://www.${linkedinMatch[0]}`;

    // --- 2. Section Extraction (Heuristic Slicing) ---
    // We'll search for indices of known Headers

    // Map text to headers
    const headers = {
        contact: /INFORMAÇÃO DE CONTATO|CONTACT INFO/i,
        summary: /OBJETIVO|OBJECTIVE|RESUMO|SUMMARY|SOBRE MIM|ABOUT/i,
        experience: /EXPERIÊNCIA|EXPERIENCE|WORK HISTORY|HISTÓRICO PROFISSIONAL/i,
        education: /EDUCAÇÃO|EDUCATION|FORMAÇÃO|ACADEMIC/i,
        skills: /HABILIDADES|SKILLS|COMPETÊNCIAS/i,
        languages: /IDIOMAS|LANGUAGES/i
    };

    // Helper to find start index of a section
    const findSectionStart = (regex) => {
        const match = normalizedText.match(regex);
        return match ? match.index : -1;
    };

    // Sort distinct headers by position to know where one ends and next begins
    const foundHeaders = [
        { key: 'contact', index: findSectionStart(headers.contact) },
        { key: 'summary', index: findSectionStart(headers.summary) },
        { key: 'experience', index: findSectionStart(headers.experience) },
        { key: 'education', index: findSectionStart(headers.education) },
        { key: 'skills', index: findSectionStart(headers.skills) },
        { key: 'languages', index: findSectionStart(headers.languages) }
    ].filter(h => h.index !== -1).sort((a, b) => a.index - b.index);

    // Extract content between headers
    const getSectionContent = (key) => {
        const headerObj = foundHeaders.find(h => h.key === key);
        if (!headerObj) return '';

        const nextHeaderIndex = foundHeaders.findIndex(h => h === headerObj);
        const nextHeader = foundHeaders[nextHeaderIndex + 1];

        let content = '';
        if (nextHeader) {
            content = normalizedText.substring(headerObj.index, nextHeader.index);
        } else {
            content = normalizedText.substring(headerObj.index);
        }

        // Remove the header title itself from content
        return content.replace(headers[key], '').trim();
    };

    // --- 3. Process Specific Sections ---

    // Name (fallback if not in contact info, take top of file)
    if (!sections.personalInfo.fullName) {
        // Assume name is first visual line or extracted from "Name" keywords if existing
        // For simplicity: Top 3 words
        const firstLine = normalizedText.split('\n')[0].trim();
        if (firstLine.length < 50) sections.personalInfo.fullName = firstLine;
    }

    // Summary / Objetivo
    const summaryRaw = getSectionContent('summary');
    if (summaryRaw) {
        sections.personalInfo.summary = summaryRaw.replace(/\s+/g, ' ').trim();
    }

    // Experience (Smarter Split by Date)
    const experienceRaw = getSectionContent('experience');
    if (experienceRaw) {
        sections.experience = parseExperienceItems(experienceRaw);
    }

    // Education
    const educationRaw = getSectionContent('education');
    if (educationRaw) {
        sections.education = parseEducationItems(educationRaw);
    }

    // Skills
    const skillsRaw = getSectionContent('skills');
    if (skillsRaw) {
        // Split by comma, bullet, or newline
        const list = skillsRaw.split(/[,•\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && !/HABILIDADES|SKILLS/i.test(s));
        sections.skills = list.slice(0, 15);
    }

    // Languages
    const languagesRaw = getSectionContent('languages');
    if (languagesRaw) {
        // Try to pair strings e.g. "Inglês Avançado" or split lines
        const lines = languagesRaw.split('\n').filter(l => l.trim().length > 2);
        sections.languages = lines.map((line, i) => {
            return { id: i, name: line.trim(), level: '' }; // Naive
        }).slice(0, 5);
    }

    // Nationality from raw text if possible
    const nationalityMatch = cleanedGlobal.match(/(Brasileiro|Brasileira|Brazilian)/i);
    if (nationalityMatch) sections.personalInfo.nationality = nationalityMatch[0];

    return sections;
};

// Helper: Parse Items based on Date Patterns (Month Year - Month Year)
const parseExperienceItems = (text) => {
    // Regex for date ranges like: "Jan 2020 - Dec 2021", "01/2020 - Present", "Ago 2024 - Jan 2026"
    // We look for patterns that likely start a new block.
    // This splits the text block by looking ahead for a date pattern.

    const items = [];

    // Split by lines
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    let currentItem = null;

    // Regex strategies for detecting a "Header" line of an experience item
    // Strategy 1: Look for lines containing a Date Range
    const dateRangeRegex = /((?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez|january|february|march|april|may|june|july|august|september|october|november|december|\d{2})\/?\s?\d{2,4}\s?[-–to]\s?(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez|january|february|march|april|may|june|july|august|september|october|november|december|\d{2}|present|presente|atual)\/?\s?\d{0,4})/i;

    lines.forEach(line => {
        const hasDate = dateRangeRegex.test(line);

        if (hasDate) {
            // Push previous
            if (currentItem) items.push(currentItem);

            // Start new
            currentItem = {
                company: '', // We'll try to extract, otherwise leave blank to edit
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                description: ''
            };

            // Extract Date
            const match = line.match(dateRangeRegex);
            if (match) {
                const dates = match[0].split(/[-–to]/);
                currentItem.startDate = dates[0].trim();
                currentItem.endDate = dates[1] ? dates[1].trim() : '';
                if (/present|atual/i.test(currentItem.endDate)) currentItem.isCurrent = true;

                // Content *before* or *after* date in the same line might be Company/Role
                const remaining = line.replace(match[0], '').trim();
                if (remaining.length > 2) currentItem.company = remaining;
                // Wait, your layout has Date on Left, Role/Company on Right. 
                // PDF extraction might have "Ago 2021 - Jan 2026 Product Designer" on one line.
                // Or "Product Designer" on next line.
            }
        } else {
            // Append to current
            if (currentItem) {
                // Heuristic: If we don't have position/company yet, assume these lines are it
                if (!currentItem.position && line.length < 50) currentItem.position = line;
                else if (!currentItem.company && line.length < 50) currentItem.company = line;
                else currentItem.description += line + '\n';
            }
        }
    });

    if (currentItem) items.push(currentItem);

    // Fallback: If no dates found, return big block
    if (items.length === 0 && text.length > 10) {
        return [{
            company: 'Experiência (Não foi possível separar automaticamente)',
            position: 'Verificar PDF',
            description: text
        }];
    }

    return items;
};

const parseEducationItems = (text) => {
    // Similar logic but simpler
    const items = [];
    const lines = text.split('\n').filter(l => l.trim());
    let currentItem = null;
    // Simple heuristic: Every 3 lines is a new item? checking for dates?
    // Let's look for dates again
    const dateRegex = /\d{4}/; // Simple year check

    lines.forEach(line => {
        if (dateRegex.test(line) && line.length < 40) { // Likely a meta line
            if (currentItem) items.push(currentItem);
            currentItem = { school: '', degree: '', startDate: '', endDate: '' };

            // Extract years
            const years = line.match(/\d{4}/g);
            if (years) {
                if (years.length >= 1) currentItem.startDate = years[0];
                if (years.length >= 2) currentItem.endDate = years[1];
            }
        } else {
            if (currentItem) {
                if (!currentItem.degree) currentItem.degree = line;
                else if (!currentItem.school) currentItem.school = line;
            }
        }
    });

    if (currentItem) items.push(currentItem);

    if (items.length === 0 && text.length > 10) {
        return [{
            school: 'Instituição (Editar)',
            degree: text.substring(0, 100),
            startDate: ''
        }];
    }
    return items;
};
