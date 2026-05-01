import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const prompt = "Genera 3 datos curiosos de historia universal, mitología griega o curiosidades botánicas. Deben ser datos raros, breves (máximo 4 líneas) y escritos en un tono amable. Devuélvelos en formato JSON estricto: [{\"cat\": \"\", \"title\": \"\", \"body\": \"\", \"emoji\": \"\", \"catColor\": \"\"}]. Para 'cat' usa solo 'griegos', 'plantas' o 'historia'. Para 'catColor' usa #534AB7 para griegos, #0F6E56 para plantas y #993C1D para historia.";
    
    const responseSchema = {
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
    };

    const resp = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const data = JSON.parse(resp.text);
    return Response.json({ curiosities: data });
  } catch (error) {
    return Response.json({ error: true, message: error.message }, { status: 500 });
  }
}
