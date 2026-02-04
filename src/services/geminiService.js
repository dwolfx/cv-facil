
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// We will use a placeholder key if not process.env is set, but it will error on request if invalid.
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const optimizeSummary = async (summary) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash', // Updated to latest fast model
            contents: `Optimize this professional summary for a resume to be more impactful and professional, keeping it concise (max 3-4 sentences). It must be ATS-friendly. Input: ${summary}`,
        });
        return response.text() || summary;
    } catch (error) {
        console.error("AI Optimization Error:", error);
        return summary;
    }
};

export const optimizeDescription = async (desc) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Convert this job description into professional bullet points highlighting achievements and using action verbs. Ensure it's ATS-friendly. Input: ${desc}`,
        });
        return response.text() || desc;
    } catch (error) {
        console.error("AI Optimization Error:", error);
        return desc;
    }
};

export const translateResume = async (data, targetLang) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Translate the content of this resume JSON data to ${targetLang}. Translate all values, especially the summary, job descriptions, and positions. Keep technical terms appropriate for the professional context in ${targetLang}. 
      Return ONLY the translated JSON following EXACTLY this structure: ${JSON.stringify(data)}`,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text() || '{}';
        return JSON.parse(text);
    } catch (e) {
        console.error("Translation failed", e);
        return data;
    }
};

export const extractFromImage = async (base64Data, mimeType) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                { inlineData: { data: base64Data, mimeType } },
                { text: "Analise este documento e extraia todas as informações para preencher um currículo. Extraia: Nome completo, email, telefone, localização, linkedin, resumo profissional (summary), experiências (lista com empresa, cargo, local, data início, data fim e descrição) e educação. Retorne APENAS um JSON puro que siga exatamente esta estrutura dos campos: { \"personalInfo\": { \"fullName\": \"\", \"email\": \"\", \"phone\": \"\", \"location\": \"\", \"linkedin\": \"\", \"website\": \"\", \"summary\": \"\" }, \"experience\": [{\"company\": \"\", \"position\": \"\", \"location\": \"\", \"period\": \"\", \"description\": \"\"}], \"education\": [{\"school\": \"\", \"degree\": \"\", \"period\": \"\"}], \"skills\": [] }" }
            ],
            config: {
                responseMimeType: "application/json"
            }
        });

        const text = response.text();
        if (!text) throw new Error("Nenhum dado retornado pelo modelo");
        return JSON.parse(text);
    } catch (error) {
        console.error("Extraction failed", error);
        throw error;
    }
};
