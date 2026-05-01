import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const prompt = "Genera 3 datos curiosos de historia universal, mitología griega o curiosidades botánicas. Deben ser datos raros, breves (máximo 4 líneas) y escritos en un tono amable. Devuélvelos en formato JSON estricto: [{\"cat\": \"\", \"title\": \"\", \"body\": \"\", \"emoji\": \"\", \"catColor\": \"\"}]. Para 'cat' usa solo 'griegos', 'plantas' o 'historia'. Para 'catColor' usa #534AB7 para griegos, #0F6E56 para plantas y #993C1D para historia.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cat: { type: Type.STRING },
              title: { type: Type.STRING },
              body: { type: Type.STRING },
              emoji: { type: Type.STRING },
              catColor: { type: Type.STRING }
            },
            required: ["cat", "title", "body", "emoji", "catColor"]
          }
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    const data = JSON.parse(response.text);
    
    return Response.json({ curiosities: data });
  } catch (error) {
    console.error("Knowledge API error:", error);
    return Response.json({ error: true, message: error.message }, { status: 500 });
  }
}
