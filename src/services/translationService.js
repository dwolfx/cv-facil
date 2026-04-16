/**
 * Service for translating CV content using DeepL API.
 */

const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY
const DEEPL_API_URL = '/api-deepl/v2/translate'

/**
 * Translates a single string or an array of strings.
 * @param {string|string[]} text - Text to translate.
 * @param {string} targetLang - Target language code (e.g., 'EN', 'ES').
 * @returns {Promise<string|string[]>} - Translated text.
 */
export const translateText = async (text, targetLang) => {
    if (!text || (Array.isArray(text) && text.length === 0)) return text

    if (!DEEPL_API_KEY) {
        throw new Error('Chave da API DeepL não configurada no .env')
    }

    try {
        const isArray = Array.isArray(text)
        const textsToTranslate = isArray ? text : [text]

        const params = new URLSearchParams()
        params.append('target_lang', targetLang)
        textsToTranslate.forEach(t => params.append('text', t))

        const response = await fetch(DEEPL_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            },
            body: params
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'DeepL API error')
        }

        const data = await response.json()
        const translations = data.translations.map(t => t.text)

        return isArray ? translations : translations[0]
    } catch (error) {
        console.error('Translation error:', error)
        throw error // Throw error to be caught by the UI
    }
}

/**
 * Translates the entire resume content structure.
 * @param {Object} resumeData - The original resume data.
 * @param {string} targetLang - Target language code ('EN', 'ES').
 * @returns {Promise<Object>} - The translated resume data.
 */
export const translateResume = async (resumeData, targetLang) => {
    const translatedData = JSON.parse(JSON.stringify(resumeData)) // Deep clone
    const textsToTranslate = []

    // Helper to add text and keep track of where it belongs
    const registry = []
    const add = (obj, key) => {
        if (obj && obj[key] && typeof obj[key] === 'string') {
            textsToTranslate.push(obj[key])
            registry.push({ obj, key })
        }
    }

    // 1. Personal Info
    add(translatedData.personalInfo, 'role')
    add(translatedData.personalInfo, 'summary')

    // 2. Experience
    if (translatedData.experience) {
        translatedData.experience.forEach(exp => {
            add(exp, 'role')
            add(exp, 'description')
            add(exp, 'location')
        })
    }

    // 3. Education
    if (translatedData.education) {
        translatedData.education.forEach(edu => {
            add(edu, 'degree')
            add(edu, 'field')
            add(edu, 'location')
            add(edu, 'description')
        })
    }

    // 4. Skills (Array of strings)
    let skillsIndex = -1
    if (translatedData.skills && translatedData.skills.length > 0) {
        skillsIndex = textsToTranslate.length
        textsToTranslate.push(...translatedData.skills)
    }

    // 5. Languages
    if (translatedData.languages) {
        translatedData.languages.forEach(lang => {
            add(lang, 'name')
            add(lang, 'level')
        })
    }

    // Execute batch translation
    if (textsToTranslate.length > 0) {
        const results = await translateText(textsToTranslate, targetLang)
        const translatedArray = Array.isArray(results) ? results : [results]

        // Redistribute translated strings
        let cursor = 0
        registry.forEach(item => {
            item.obj[item.key] = translatedArray[cursor++]
        })

        // Handles skills separately if they were added
        if (skillsIndex !== -1) {
            cursor = skillsIndex
            translatedData.skills = translatedData.skills.map(() => translatedArray[cursor++])
        }
    }

    return translatedData
}
