
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

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        let lastY = null;
        let pageText = '';

        // Sort items by Y (descending often for PDF) then X? 
        // pdf.js usually returns reading order, but not guaranteed.
        // For simplicity, we rely on the returned order but check Y for line breaks.

        for (const item of textContent.items) {
            // item.transform is [scaleX, skewY, skewX, scaleY, tx, ty]
            const currentY = item.transform[5];

            if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                pageText += '\n';
            } else if (pageText.length > 0 && !pageText.endsWith('\n')) {
                // Add space between words on same line
                pageText += ' ';
            }

            pageText += item.str;
            lastY = currentY;
        }

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
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ');
    const lines = normalizedText.split('\n').filter(line => line.trim().length > 0);
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

    const linkedinMatch = cleanedGlobal.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) sections.personalInfo.linkedin = `https://www.${linkedinMatch[0]}`;

    // --- 2. Improved Name Extraction ---
    // Heuristic: The Name is usually the very first line of the document, 
    // especially if it doesn't look like a header or contact info.
    if (lines.length > 0) {
        const firstLine = lines[0].trim();
        // Avoid if it looks like "Page 1" or "Curriculum"
        if (firstLine.length > 3 && !/página|page|currículo|cv/i.test(firstLine)) {
            sections.personalInfo.fullName = firstLine;
        }
    }

    // --- 3. Section Extraction (Strict Headers) ---
    // We expect headers to be at the start of a line or surrounded by newlines
    const headers = {
        contact: /(?:\n|^)\s*(INFORMAÇÃO DE CONTATO|CONTACT INFO|CONTATO)/i,
        summary: /(?:\n|^)\s*(OBJETIVO|OBJECTIVE|RESUMO|SUMMARY|SOBRE MIM|ABOUT|PERFIL)/i,
        experience: /(?:\n|^)\s*(EXPERIÊNCIA|EXPERIENCE|WORK HISTORY|HISTÓRICO PROFISSIONAL)/i,
        education: /(?:\n|^)\s*(EDUCAÇÃO|EDUCATION|FORMAÇÃO|ACADEMIC|HISTÓRICO ACADÊMICO)/i,
        skills: /(?:\n|^)\s*(HABILIDADES|SKILLS|COMPETÊNCIAS|TECHNICAL SKILLS)/i,
        languages: /(?:\n|^)\s*(IDIOMAS|LANGUAGES)/i
    };

    const findSectionIndex = (regex) => {
        const match = normalizedText.match(regex);
        return match ? match.index : -1;
    };

    const foundHeaders = [
        { key: 'contact', index: findSectionIndex(headers.contact) },
        { key: 'summary', index: findSectionIndex(headers.summary) },
        { key: 'experience', index: findSectionIndex(headers.experience) },
        { key: 'education', index: findSectionIndex(headers.education) },
        { key: 'skills', index: findSectionIndex(headers.skills) },
        { key: 'languages', index: findSectionIndex(headers.languages) }
    ].filter(h => h.index !== -1).sort((a, b) => a.index - b.index);

    const getSectionContent = (key) => {
        const headerObj = foundHeaders.find(h => h.key === key);
        if (!headerObj) return '';

        const nextHeaderIndex = foundHeaders.findIndex(h => h === headerObj);
        const nextHeader = foundHeaders[nextHeaderIndex + 1];

        let content = '';
        // If there is a next header, cut until there.
        // If not, maybe we should stop at the end of text?
        // Check if there's any other header (not in our list) that might signal end? 
        // For now, assume these are the main ones.

        if (nextHeader) {
            content = normalizedText.substring(headerObj.index, nextHeader.index);
        } else {
            content = normalizedText.substring(headerObj.index);
        }

        // Remove the header title line itself
        // We split by newline and drop the first line which contains the match
        const sectionLines = content.split('\n');
        if (sectionLines.length > 0) {
            // The first line is likely the header title, remove it
            // BUT, verify if the match actually occupied the whole line or just start
            // Usually it's the whole line for these headers.
            return sectionLines.slice(1).join('\n').trim();
        }
        return content.replace(headers[key], '').trim();
    };

    // Populate Sections
    const summaryRaw = getSectionContent('summary');
    if (summaryRaw) sections.personalInfo.summary = summaryRaw.replace(/\s+/g, ' ').trim();

    const experienceRaw = getSectionContent('experience');
    if (experienceRaw) sections.experience = parseExperienceItems(experienceRaw);

    const educationRaw = getSectionContent('education');
    if (educationRaw) sections.education = parseEducationItems(educationRaw);

    const skillsRaw = getSectionContent('skills');
    if (skillsRaw) {
        // Split by bullets, commas or newlines
        // Filter out junk
        const list = skillsRaw.split(/[,•\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && !/HABILIDADES|SKILLS/i.test(s));

        // Deduplicate and limit
        sections.skills = [...new Set(list)].slice(0, 15);
    }

    // Languages - Try to preserve level if on same line e.g. "Inglês Avançado" or "Inglês - Avançado"
    const languagesRaw = getSectionContent('languages');
    if (languagesRaw) {
        const langLines = languagesRaw.split('\n').filter(l => l.trim().length > 3);
        sections.languages = langLines.map((line, i) => {
            // Naive split: "Language - Level" or Just "Language Level"
            let name = line;
            let level = '';

            if (line.includes('-')) {
                const parts = line.split('-');
                name = parts[0].trim();
                level = parts[1].trim();
            } else if (line.includes(':')) {
                const parts = line.split(':');
                name = parts[0].trim();
                level = parts[1].trim();
            }
            return { id: i, name, level };
        }).slice(0, 6);
    }

    const nationalityMatch = cleanedGlobal.match(/(Brasileiro|Brasileira|Brazilian)/i);
    if (nationalityMatch) sections.personalInfo.nationality = nationalityMatch[0];

    return sections;
};

// Start of Logic: Experience Parsing
const parseExperienceItems = (text) => {
    const items = [];
    const lines = text.split('\n').filter(l => l.trim());

    let currentItem = null;

    // Improved Regex to match "Mon Year - Mon Year" or "Mon Year"
    // Matches start of line or generally isolated dates
    const dateRangeRegex = /((?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez|january|february|march|april|may|june|july|august|september|october|november|december|\d{2})\/?\s?\d{2,4}\s?[-–to]\s?(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez|january|february|march|april|may|june|july|august|september|october|november|december|\d{2}|present|presente|atual)\/?\s?\d{0,4})/i;

    lines.forEach(line => {
        const dateMatch = line.match(dateRangeRegex);

        if (dateMatch) {
            // New Item Detected by Date
            if (currentItem) items.push(currentItem);

            currentItem = {
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                description: ''
            };

            // Parse Dates
            const fullDateStr = dateMatch[0];
            const dates = fullDateStr.split(/[-–to]/);
            currentItem.startDate = dates[0].trim();
            currentItem.endDate = dates[1] ? dates[1].trim() : '';
            if (/present|atual/i.test(currentItem.endDate)) currentItem.isCurrent = true;

            // Handle Text on the Same Line as Date
            // e.g. "Ago 2021 - Jan 2026 Product Designer"
            // or "Company Name Ago 2021 - Jan 2026"

            const remaining = line.replace(fullDateStr, '').trim();

            if (remaining.length > 0) {
                // Heuristic: Short text is likely Role/Company. Long text is Description.
                if (remaining.length < 50) {
                    // If we don't know if it's company or role, assume Role (Position) is often next to date
                    // But in your PDF image, Company seems to be above? Or same line?
                    // Let's assume Position.
                    currentItem.position = remaining;
                } else {
                    // Too long, likely description
                    currentItem.description += remaining + '\n';
                }
            }
        } else {
            // Line without Date
            if (currentItem) {
                // If Item is fresh (no description yet), try to fill Position/Company from short lines
                const isShort = line.length < 60;

                if (isShort && !currentItem.description) {
                    if (!currentItem.position) {
                        currentItem.position = line;
                    } else if (!currentItem.company) {
                        currentItem.company = line;
                    } else {
                        // We have both, maybe Location?
                        if (/Brazil|SP|MG|RJ|Remote|Remoto/i.test(line)) {
                            currentItem.location = line;
                        } else {
                            // Otherwise, likely bullet point start
                            currentItem.description += line + '\n';
                        }
                    }
                } else {
                    // Description
                    currentItem.description += line + '\n';
                }
            } else {
                // Text before any date found? Maybe a stray header or garbage.
                // Ignore or create a dummy item if it's long enough
            }
        }
    });

    if (currentItem) items.push(currentItem);

    // Fallback
    if (items.length === 0 && text.length > 20) {
        return [{ company: 'Experiência (Não separada)', position: '', description: text }];
    }

    return items;
};

const parseEducationItems = (text) => {
    const items = [];
    const lines = text.split('\n').filter(l => l.trim());
    let currentItem = null;
    const dateRegex = /\d{4}/;

    lines.forEach(line => {
        if (dateRegex.test(line) && line.length < 40) {
            if (currentItem) items.push(currentItem);
            currentItem = { school: '', degree: '', startDate: '', endDate: '' };

            const years = line.match(/\d{4}/g);
            if (years) {
                if (years.length >= 1) currentItem.startDate = years[0];
                if (years.length >= 2) currentItem.endDate = years[1];
            }
        } else {
            if (currentItem) {
                if (!currentItem.degree) currentItem.degree = line;
                else if (!currentItem.school) currentItem.school = line;
            } else {
                // Start first item if valid text
                if (line.length > 3) {
                    currentItem = { school: '', degree: line, startDate: '', endDate: '' };
                }
            }
        }
    });

    if (currentItem) items.push(currentItem);
    if (items.length === 0 && text.length > 10) {
        return [{ school: 'Instituição (Editar)', degree: text.substring(0, 100), startDate: '' }];
    }
    return items;
};
