import { GoogleGenAI } from "@google/genai";
import { HealthData, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getPredictionExplanation(data: HealthData, risk: RiskLevel): Promise<string> {
  const prompt = `
    You are an AI assistant tasked with generating a structured health report section based on a user's health data for diabetes risk.

    **Objective:**
    Generate a detailed report that includes:
    1.  **Introduction:** A brief, general overview of diabetes as a health concern and the importance of monitoring key health metrics.
    2.  **Analysis of Your Health Metrics:** A personalized analysis of the user's provided data, explaining how each key factor (Glucose, BMI, Age, etc.) contributes to their calculated risk level.
    3.  **Wellness Recommendations:** General, non-prescriptive advice on diet, exercise, and lifestyle that can support overall health.
    4.  **Conclusion:** A concluding summary that reiterates the risk level and strongly emphasizes that this report is not medical advice and the user must consult a healthcare professional.

    **Formatting Rules:**
    - Use Markdown for formatting.
    - Use the following headings exactly:
        - ## Introduction
        - ## Analysis of Your Health Metrics
        - ## Wellness Recommendations
        - ## Conclusion
    - Use bullet points for lists (e.g., wellness tips), starting with a hyphen.
    - Use bold text for emphasis.
    - Keep the tone professional, encouraging, and supportive.

    **Critical Safety Instructions:**
    - **DO NOT** provide any medical diagnosis or prescribe treatment.
    - **ALWAYS** include a clear and prominent disclaimer advising consultation with a doctor within the conclusion.

    **User's Data:**
    - Pregnancies: ${data.Pregnancies}
    - Glucose: ${data.Glucose} mg/dL
    - Blood Pressure: ${data.BloodPressure} mm Hg
    - BMI: ${data.BMI}
    - Age: ${data.Age} years
    - Diabetes Pedigree Function: ${data.DiabetesPedigreeFunction}

    **Calculated Risk Level:** ${risk}

    Please generate the report content now.
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not get an explanation from the AI model.");
  }
}
