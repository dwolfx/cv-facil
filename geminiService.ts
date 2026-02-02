
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeSummary = async (summary: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Optimize this professional summary for a resume to be more impactful and professional, keeping it concise (max 3-4 sentences). It must be ATS-friendly. Input: ${summary}`,
  });
  return response.text || summary;
};

export const optimizeDescription = async (desc: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Convert this job description into professional bullet points highlighting achievements and using action verbs. Ensure it's ATS-friendly. Input: ${desc}`,
  });
  return response.text || desc;
};

export const translateResume = async (data: any, targetLang: string): Promise<any> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Translate the content of this resume JSON data to ${targetLang}. Translate all values, especially the summary, job descriptions, and positions. Keep technical terms appropriate for the professional context in ${targetLang}. 
    Return ONLY the translated JSON following EXACTLY this structure: ${JSON.stringify(data)}`,
    config: { responseMimeType: "application/json" }
  });
  try {
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (e) {
    console.error("Translation failed", e);
    return data;
  }
};

export const extractFromImage = async (base64Data: string, mimeType: string): Promise<any> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { inlineData: { data: base64Data, mimeType } },
      { text: "Analise este documento e extraia todas as informações para preencher um currículo. Extraia: Nome completo, email, telefone, localização, linkedin, resumo profissional (summary), experiências (lista com empresa, cargo, local, data início, data fim e descrição) e educação. Retorne APENAS um JSON puro que siga exatamente esta estrutura: { \"fullName\": \"\", \"email\": \"\", \"phone\": \"\", \"location\": \"\", \"linkedin\": \"\", \"website\": \"\", \"summary\": \"\", \"experiences\": [{\"company\": \"\", \"position\": \"\", \"location\": \"\", \"startDate\": \"\", \"endDate\": \"\", \"description\": \"\"}], \"education\": [{\"school\": \"\", \"degree\": \"\", \"location\": \"\", \"graduationDate\": \"\"}], \"skills\": [] }" }
    ],
    config: { 
      responseMimeType: "application/json"
    }
  });
  const text = response.text;
  if (!text) throw new Error("Nenhum dado retornado pelo modelo");
  return JSON.parse(text);
};
