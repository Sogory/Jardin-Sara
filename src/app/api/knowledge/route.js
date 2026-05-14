import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const { userName = "Sara", count = 3 } = await request.json();
    // Clamp entre 3 y 20 para no exceder límites razonables
    const safeCount = Math.min(Math.max(parseInt(count) || 3, 3), 20);

    const prompt = `Genera exactamente ${safeCount} datos curiosos de historia universal, mitología griega o curiosidades botánicas para ${userName}. Deben ser datos raros, breves (máximo 4 líneas) y escritos en un tono amable. Varía las categorías de forma equilibrada. Devuélvelos en formato JSON estricto como un array de ${safeCount} objetos: [{"cat": "", "title": "", "body": "", "emoji": "", "catColor": ""}]. Para 'cat' usa solo 'griegos', 'plantas' o 'historia'. Para 'catColor' usa #534AB7 para griegos, #0F6E56 para plantas y #993C1D para historia.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;

    const data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

    return Response.json({ curiosities: data });
  } catch (error) {
    console.error("Knowledge API error:", error);
    return Response.json({ error: true, response: error.message }, { status: 500 });
  }
}
