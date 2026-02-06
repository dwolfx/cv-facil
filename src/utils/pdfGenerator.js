import { jsPDF } from "jspdf";

export const generateResumePDF = (resumeData) => {
    const doc = new jsPDF();
    let y = 20; // Start Y position
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = doc.internal.pageSize.width - (margin * 2);

    const checkPageBreak = (neededSpace) => {
        if (y + neededSpace > pageHeight - margin) {
            doc.addPage();
            y = 20;
        }
    };

    // Helper to draw section title
    const drawSectionTitle = (title) => {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 58, 138); // #1e3a8a
        doc.text(title.toUpperCase(), margin, y);
        y += 2;
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.line(margin, y, margin + contentWidth, y);
        y += 8;
    };

    // 1. Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);

    const name = resumeData.personalInfo.fullName || "Nome Completo";
    const nameLines = doc.splitTextToSize(name, contentWidth);
    doc.text(nameLines, margin, y);
    y += (nameLines.length * 8);

    doc.setFontSize(12);
    doc.setTextColor(69, 96, 181); // #4560b5
    const role = resumeData.personalInfo.role || "Cargo";
    doc.text(role, margin, y);
    y += 15;

    // 2. Personal Info (Left column empty logic from design? No, let's just list them)
    // Design has labels on left (140px ~ 40mm) and content on right.
    const labelX = margin;
    const contentX = margin + 45; // 45mm offset

    const drawField = (label, value) => {
        if (!value) return;
        checkPageBreak(7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(30, 58, 138);
        doc.text(label, labelX, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text(String(value), contentX, y);
        y += 6;
    };

    drawSectionTitle("Dados Pessoais");

    if (resumeData.personalInfo.email) drawField("E-mail:", resumeData.personalInfo.email);
    if (resumeData.personalInfo.phone) drawField("Telefone:", resumeData.personalInfo.phone);
    if (resumeData.personalInfo.nationality) drawField("Nacionalidade:", resumeData.personalInfo.nationality);
    if (resumeData.personalInfo.locations && resumeData.personalInfo.locations.length > 0) {
        drawField("Endereço:", resumeData.personalInfo.locations.join(' • '));
    }
    if (resumeData.personalInfo.linkedin) drawField("LinkedIn:", resumeData.personalInfo.linkedin);
    if (resumeData.personalInfo.portfolio) drawField("Portfólio:", resumeData.personalInfo.portfolio);

    y += 5;

    // 3. Summary
    if (resumeData.personalInfo.summary) {
        drawSectionTitle("Sobre Mim");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);

        const summaryLines = doc.splitTextToSize(resumeData.personalInfo.summary.replace(/<[^>]*>?/gm, ''), contentWidth - 45); // Strip HTML for simple PDF text
        checkPageBreak(summaryLines.length * 5);
        doc.text(summaryLines, contentX, y);
        y += (summaryLines.length * 5) + 10;
    }

    // 4. Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        drawSectionTitle("Experiência");

        resumeData.experience.forEach(exp => {
            // Date & Location (Left)
            const dateRange = `${exp.startDate || ''} - ${exp.isCurrent ? 'Presente' : (exp.endDate || '')}`;

            checkPageBreak(20); // Check enough for header

            // Left Column
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(69, 96, 181);
            doc.text(exp.location || '', labelX, y);

            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184); // slate-400
            doc.text(dateRange, labelX, y + 5);

            // Right Column
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(30, 58, 138);
            doc.text(exp.position || 'Cargo', contentX, y);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(exp.company || 'Empresa', contentX, y + 5);

            y += 12;

            // Description
            if (exp.description) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(71, 85, 105);
                const descLines = doc.splitTextToSize(exp.description.replace(/<[^>]*>?/gm, ''), contentWidth - 45);
                checkPageBreak(descLines.length * 5);
                doc.text(descLines, contentX, y);
                y += (descLines.length * 5);
            }
            y += 8; // Spacing between items
        });
        y += 5;
    }

    // 5. Education
    if (resumeData.education && resumeData.education.length > 0) {
        drawSectionTitle("Educação");

        resumeData.education.forEach(edu => {
            const dateRange = `${edu.startDate || ''} - ${edu.isCurrent ? 'Presente' : (edu.endDate || '')}`;
            checkPageBreak(15);

            // Left Column (Meta)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(69, 96, 181); // #4560b5
            doc.text(edu.location || '', labelX, y);

            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184); // slate-400
            doc.text(dateRange, labelX, y + 5);

            // Right Column (Content)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(30, 58, 138); // #1e3a8a
            doc.text(edu.degree || 'Curso', contentX, y);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(edu.school || 'Instituição', contentX, y + 5);

            y += 12;
        });
        y += 5;
    }

    // 6. Languages (Left) & Skills (Right) Split Section
    const hasLanguages = resumeData.languages && resumeData.languages.length > 0;
    const hasSkills = resumeData.skills && resumeData.skills.length > 0;

    if (hasLanguages || hasSkills) {
        checkPageBreak(30); // Ensure space for the block

        // Draw Top Border for this section
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.line(margin, y, margin + contentWidth, y);
        y += 8;

        const startSectionY = y;

        // --- Languages (Left Column: labelX) ---
        // In Editor, this column is 'text-right' (width 140px ~ 40mm).
        // labelX is at margin (20). contentX is at margin + 45.
        // So the left column width available is roughly 40mm.
        // To right-align text in PDF at x=40mm (relative to page) or just before contentX?
        // Let's use `align: 'right'` at x = contentX - 5 (gap).

        let langY = startSectionY; // Initialize langY here

        if (hasLanguages) {
            const langX = contentX - 5; // Right align anchor

            // Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8); // Match text-[10px]
            doc.setTextColor(30, 58, 138); // #1e3a8a
            doc.text("IDIOMAS", langX, langY + 3, { align: "right" }); // +3 to align baseline with Skills title?
            // Actually Skills title is at rightColY. Let's sync Y.

            langY += 10;

            resumeData.languages.forEach(lang => {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9); // 11px
                doc.setTextColor(37, 99, 235); // #2563eb
                doc.text(lang.name || '', langX, langY, { align: "right" });

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8); // 10px
                doc.setTextColor(100, 116, 139); // slate-500
                doc.text(lang.level || '', langX, langY + 4, { align: "right" });

                langY += 10;
            });
            // Store langY if needed, but we rely on max of layouts.
        }

        // --- Skills (Right Column: contentX) ---
        let rightColY = startSectionY;

        if (hasSkills) {
            // Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8); // 10px
            doc.setTextColor(30, 58, 138); // #1e3a8a
            doc.text("HABILIDADES", contentX, rightColY + 3);
            rightColY += 10;

            // Grid of Skills (2 columns within the Right Content Column)
            const skillsColWidth = (contentWidth - 45) / 2;

            resumeData.skills.forEach((skill, i) => {
                const colIndex = i % 2;
                const xPos = contentX + (colIndex * skillsColWidth);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(9); // 11px
                doc.setTextColor(37, 99, 235); // #2563eb
                doc.text(skill, xPos, rightColY);

                if (colIndex === 1) {
                    rightColY += 6;
                }
            });
            if (resumeData.skills.length % 2 !== 0) {
                rightColY += 6;
            }
        }

        // Update main Y
        // We didn't track langY fully in the variable scope above, let's fix that calculation logic roughly
        // assuming skills will likely be longer or equal.
        y = Math.max(langY, rightColY);
    }

    // Save
    doc.save(`${resumeData.personalInfo.fullName || 'curriculo'}.pdf`);
};
