
// Template Registry
import ModernPreview from './modern/Preview';
import { generateModernPDF } from './modern/pdfGenerator';
import ClassicPreview from './classic/Preview';
import { generateClassicPDF } from './classic/pdfGenerator';
import MinimalistPreview from './minimalist/Preview';
import { generateMinimalistPDF } from './minimalist/pdfGenerator';

export const templates = {
    modern: {
        id: 'modern',
        name: 'Moderno',
        component: ModernPreview,
        pdfGenerator: generateModernPDF,
        description: 'Clean, professional, and blue-accented design.',
    },
    classic: {
        id: 'classic',
        name: 'Clássico',
        component: ClassicPreview,
        pdfGenerator: generateClassicPDF,
        description: 'Traditional layout with serif fonts and elegant typography.',
    },
    minimalist: {
        id: 'minimalist',
        name: 'Minimalista',
        component: MinimalistPreview,
        pdfGenerator: generateMinimalistPDF,
        description: 'Simple, centered layout with focus on content.',
    }
};

export const getTemplate = (id) => templates[id] || templates.modern;
