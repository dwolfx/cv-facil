import { jsPDF } from "jspdf";

// Constants
const MARGIN = 15; // 15mm (Reduced from 20mm to match Preview's 40px ~= 10mm-15mm)
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Helper: Rich Text Drawer
const drawRichText = (doc, text, x, startY, maxWidth, fontSize, color, isDryRun) => {
    if (!text) return startY;

    // Apply basic font settings for metrics
    doc.setFontSize(fontSize);
    if (!isDryRun) {
        doc.setTextColor(color[0], color[1], color[2]);
    }

    const lineHeight = fontSize * 0.45; // Approx mm conversion
    let cursorX = x;
    let cursorY = startY;

    const paragraphs = text.split('\n');

    paragraphs.forEach((paragraph, pIndex) => {
        const parts = paragraph.split(/(\*\*.*?\*\*)/g);
        let tokens = [];

        parts.forEach(part => {
            const isBold = part.startsWith('**') && part.endsWith('**');
            const content = isBold ? part.slice(2, -2) : part;
            const words = content.split(/(\s+)/);
            words.forEach(word => {
                if (word) tokens.push({ text: word, isBold });
            });
        });

        tokens.forEach(token => {
            // Apply font style ALWAYS for correct metric calculation
            doc.setFont("helvetica", token.isBold ? "bold" : "normal");

            const tokenWidth = doc.getTextWidth(token.text);

            if (cursorX + tokenWidth > x + maxWidth) {
                cursorX = x;
                cursorY += lineHeight;
            }

            if (!isDryRun) doc.text(token.text, cursorX, cursorY);
            cursorX += tokenWidth;
        });

        if (pIndex < paragraphs.length - 1) {
            cursorX = x;
            cursorY += lineHeight * 1.5;
        }
    });

    return cursorY + lineHeight;
};

// Main Rendering Logic
const renderResumeContent = (doc, resumeData, isDryRun) => {
    let y = 20; // Start Y

    // Helper: Section Title
    const drawSectionTitle = (title) => {
        // Font settings for metrics
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        if (!isDryRun) {
            doc.setTextColor(30, 58, 138); // #1e3a8a
            doc.text(title.toUpperCase(), MARGIN, y);
            doc.setDrawColor(229, 231, 235); // gray-200
            doc.line(MARGIN, y + 2, MARGIN + CONTENT_WIDTH, y + 2);
        }
        y += 12; // Increased Gap (Title to Content)
    };

    // Helper: Field
    const labelX = MARGIN;
    const contentX = MARGIN + 45;

    const drawField = (label, value) => {
        if (!value) return;

        // Label Font
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        if (!isDryRun) {
            doc.setTextColor(30, 58, 138);
            doc.text(label, labelX, y);
        }

        // Value Font
        doc.setFont("helvetica", "normal");
        // Maintain size 9 (defaulted from above if not changed) or explicitly set if needed. 
        // Logic assumed 9 previously.

        if (!isDryRun) {
            doc.setTextColor(71, 85, 105);
            doc.text(String(value), contentX, y);
        }
        y += 6; // Increased Line Gap
    };

    // --- 1. Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    if (!isDryRun) {
        doc.setTextColor(30, 58, 138);
    }

    const name = resumeData.personalInfo.fullName || "Nome Completo";
    const nameLines = doc.splitTextToSize(name, CONTENT_WIDTH);
    if (!isDryRun) doc.text(nameLines, MARGIN, y);
    y += (nameLines.length * 8); // Approx height calculation

    doc.setFontSize(12);
    if (!isDryRun) doc.setTextColor(69, 96, 181);

    const role = resumeData.personalInfo.role || "Cargo";
    if (!isDryRun) doc.text(role, MARGIN, y);
    // Even in dry run, we assume 1 line for role if not wrapped? 
    // Role usually doesn't wrap but we should count space accurately if we wanted perfectness.
    // For now, fixed increment is fine.
    y += 14; // Increased Header Gap

    // --- 2. Personal Info ---
    drawSectionTitle("Dados Pessoais");

    if (resumeData.personalInfo.email) drawField("E-mail:", resumeData.personalInfo.email);
    if (resumeData.personalInfo.phone) drawField("Telefone:", resumeData.personalInfo.phone);
    if (resumeData.personalInfo.nationality) drawField("Nacionalidade:", resumeData.personalInfo.nationality);
    if (resumeData.personalInfo.locations && resumeData.personalInfo.locations.length > 0) {
        drawField("Endereço:", resumeData.personalInfo.locations.join(' • '));
    }
    if (resumeData.personalInfo.linkedin) drawField("LinkedIn:", resumeData.personalInfo.linkedin);
    if (resumeData.personalInfo.portfolio) drawField("Portfólio:", resumeData.personalInfo.portfolio);
    if (resumeData.personalInfo.github) drawField("GitHub:", resumeData.personalInfo.github);
    if (resumeData.personalInfo.youtube) drawField("YouTube:", resumeData.personalInfo.youtube);

    y += 8; // Section Gap

    // --- 3. Summary ---
    if (resumeData.personalInfo.summary) {
        drawSectionTitle("Objetivo");
        // drawRichText handles font settings internally
        y = drawRichText(doc, resumeData.personalInfo.summary, contentX, y, CONTENT_WIDTH - 45, 10, [71, 85, 105], isDryRun);
        y += 10;
    }

    // --- 4. Experience ---
    const formatDate = (dateString, isCurrent) => {
        if (isCurrent) return 'Presente';
        if (!dateString) return '';
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        if (dateString.includes('-')) {
            const [year, month] = dateString.split('-');
            if (month && months[parseInt(month) - 1]) return `${months[parseInt(month) - 1]}/${year}`;
            return dateString;
        }
        if (dateString.includes('/')) return dateString;
        return dateString;
    }

    if (resumeData.experience && resumeData.experience.length > 0) {
        drawSectionTitle("Experiência");

        resumeData.experience.forEach(exp => {
            const dateRange = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate, exp.isCurrent)}`;

            // Left Column
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            if (!isDryRun) {
                doc.setTextColor(69, 96, 181);
                doc.text(exp.location || '', labelX, y);
            }

            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            if (!isDryRun) {
                doc.setTextColor(148, 163, 184);
                doc.text(dateRange, labelX, y + 5);
            }

            // Right Column
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            if (!isDryRun) {
                doc.setTextColor(30, 58, 138);
                doc.text(exp.position || 'Cargo', contentX, y);
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            if (!isDryRun) {
                doc.setTextColor(100, 116, 139);
                doc.text(exp.company || 'Empresa', contentX, y + 5);
            }

            y += 10;
            y += 5; // Increased Gap between Company and Description

            if (exp.description) {
                y = drawRichText(doc, exp.description, contentX, y, CONTENT_WIDTH - 45, 10, [71, 85, 105], isDryRun);
            }
            y += 10; // Increased Item Gap
        });
        y += 5;
    }

    // --- 5. Education ---
    if (resumeData.education && resumeData.education.length > 0) {
        drawSectionTitle("Educação");

        resumeData.education.forEach(edu => {
            const dateRange = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate, edu.isCurrent)}`;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            if (!isDryRun) {
                doc.setTextColor(69, 96, 181);
                doc.text(edu.location || '', labelX, y);
            }

            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            if (!isDryRun) {
                doc.setTextColor(148, 163, 184);
                doc.text(dateRange, labelX, y + 5);
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            if (!isDryRun) {
                doc.setTextColor(30, 58, 138);
                doc.text(edu.degree || 'Curso', contentX, y);
            }

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            if (!isDryRun) {
                doc.setTextColor(100, 116, 139);
                doc.text(edu.school || 'Instituição', contentX, y + 5);
            }

            y += 14; // Increased Item Gap
        });
        y += 5;
    }

    // --- 6. Skills & Languages ---
    const hasLanguages = resumeData.languages && resumeData.languages.length > 0;
    const hasSkills = resumeData.skills && resumeData.skills.length > 0;

    if (hasLanguages || hasSkills) {
        if (!isDryRun) {
            doc.setDrawColor(229, 231, 235);
            doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
        }
        y += 12; // Gap before section

        const startSectionY = y;
        let langY = startSectionY;
        let rightColY = startSectionY;

        if (hasLanguages) {
            const langX = contentX - 5;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            if (!isDryRun) {
                doc.setTextColor(30, 58, 138);
                doc.text("IDIOMAS", langX, langY + 3, { align: "right" });
            }
            langY += 10;

            resumeData.languages.forEach(lang => {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                if (!isDryRun) {
                    doc.setTextColor(37, 99, 235);
                    doc.text(lang.name || '', langX, langY, { align: "right" });
                }

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                if (!isDryRun) {
                    doc.setTextColor(100, 116, 139);
                    doc.text(lang.level || '', langX, langY + 4, { align: "right" });
                }
                langY += 10;
            });
        }

        if (hasSkills) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            if (!isDryRun) {
                doc.setTextColor(30, 58, 138);
                doc.text("HABILIDADES", contentX, rightColY + 3);
            }
            rightColY += 10;

            const skillsColWidth = (CONTENT_WIDTH - 45) / 2;
            resumeData.skills.forEach((skill, i) => {
                const colIndex = i % 2;
                const xPos = contentX + (colIndex * skillsColWidth);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                if (!isDryRun) {
                    doc.setTextColor(37, 99, 235);
                    doc.text(skill, xPos, rightColY);
                }

                if (colIndex === 1) rightColY += 6;
            });
            if (resumeData.skills.length % 2 !== 0) rightColY += 6;
        }

        y = Math.max(langY, rightColY);
    }

    return y; // Total Height
};

export const generateResumePDF = (resumeData) => {
    // 1. Dry Run to calculate total height
    // We create a temp doc just for text width calculations
    const tempDoc = new jsPDF();
    const totalHeight = renderResumeContent(tempDoc, resumeData, true);

    // 2. Create Real Doc with custom height
    // Custom height based on content + margin.
    // Removed strict A4 implementation to avoid whitespace chunks.
    const finalHeight = totalHeight + 20; // +20mm buffer

    // Create custom format
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, finalHeight]
    });

    // 3. Render Content
    renderResumeContent(doc, resumeData, false);

    // 4. Save
    doc.save(`${resumeData.personalInfo.fullName || 'curriculo'}.pdf`);
};
