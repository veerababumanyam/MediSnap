
import { GoogleGenAI, Type } from "@google/genai";
import * as agents from './agents';
import type { Patient, Message, AiPersonalizationSettings } from '../types';

// Regex for immediate/obvious lookups (Optimization: prevents API call for simple actions)
const reportQueryRegex = /\b(show|view|display|pull up|find|get)\b.*\b(report|ecg|ekg|echo|lab|x-ray|angiogram|interrogation|log|cath|device|imaging|meds|medication|pathology|mri|biopsy)\b/i;

// --- DOMAIN CLASSIFIER ---
const determineSpecialty = async (query: string, ai: GoogleGenAI): Promise<string> => {
    // If query is very short or generic, default to General
    if (query.length < 5) return 'General';

    const prompt = `Classify this medical query into a Domain/Specialty.
    Query: "${query}"
    
    Options:
    - Cardiology (for heart, BP, ECG, Cath, HFrEF, Arrhythmia)
    - Neurology (for brain, stroke, seizure, headache, EEG, MRI Brain)
    - Oncology (for cancer, tumor, biopsy, chemo, staging)
    - Gastroenterology (for stomach, liver, GI, colonoscopy, endoscopy, abdominal pain)
    - Pulmonology (for lungs, breathing, asthma, copd, pneumonia, chest x-ray)
    - Endocrinology (for diabetes, thyroid, hormones, metabolism)
    - Orthopedics (for bones, joints, fractures, spine, pain)
    - Dermatology (for skin, rash, lesions)
    - Nephrology (for kidney, renal, creatinine, dialysis)
    - Hematology (for blood, anemia, platelets, clotting)
    - Rheumatology (for joints, autoimmune, lupus, arthritis)
    - Infectious Disease (for infection, fever, antibiotics, sepsis, culture)
    - Psychiatry (for depression, anxiety, mood, mental health)
    - Urology (for prostate, bladder, uti, kidney stone)
    - Ophthalmology (for eye, vision, retina, cataract)
    - Geriatrics (for elderly, frailty, falls, dementia)
    - DeepReasoning (for complex diagnostic dilemmas, 'think', 'reason', 'analyze complex case')
    - General (for vitals, labs, history, summary, medications)
    
    Return ONLY the Option Name.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite-preview-02-05', // Low latency for routing
            contents: prompt
        });
        return response.text.trim();
    } catch (e) {
        console.warn("Classifier failed, defaulting to General");
        return 'General';
    }
};

/**
 * Routes a user query to the appropriate AI agent.
 */
import { sendMessageToBackend } from './backendAgent';

/**
 * Routes a user query to the appropriate AI agent.
 */
export const agentRouter = async (query: string, patient: Patient, aiSettings: AiPersonalizationSettings): Promise<Message> => {
    // We now route everything to the Backend ADK Agent.
    // The backend agent handles specialty routing via tools using the patient context we pass.

    console.log(`[AgentRouter] Forwarding query to Backend ADK Agent: "${query}"`);
    return await sendMessageToBackend(query, patient);
};
