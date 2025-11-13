
import { GoogleGenAI } from "@google/genai";
import { HealthData, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getPredictionExplanation(data: HealthData, risk: RiskLevel): Promise<string> {
  const prompt = `
    You are a helpful AI assistant providing information about diabetes risk factors.
    A user has provided their health data and received a diabetes risk assessment.
    Your task is to provide a clear, concise, and encouraging explanation of the result.

    **Important Rules:**
    1.  **DO NOT** provide medical advice.
    2.  **ALWAYS** strongly recommend consulting a healthcare professional for any health concerns or before making any lifestyle changes.
    3.  Explain which factors most contributed to the risk level.
    4.  Provide general, well-known wellness tips related to diet, exercise, and stress management that can support a healthy lifestyle.
    5.  Keep the tone positive and supportive.
    6.  Format your response in simple Markdown. Use headings, bold text, and bullet points.

    **User's Data:**
    - Pregnancies: ${data.Pregnancies}
    - Glucose: ${data.Glucose} mg/dL
    - Blood Pressure: ${data.BloodPressure} mm Hg
    - BMI: ${data.BMI}
    - Age: ${data.Age} years
    - Diabetes Pedigree Function: ${data.DiabetesPedigreeFunction}

    **Prediction Result:** ${risk} Risk

    Now, please generate the explanation and wellness tips based on this information.
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
