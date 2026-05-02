import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyBKSbzisfW-BUcuvjwrQhnvESnDnrTzkPM" });
  try {
    const { userName = "Sara" } = await request.json();
    const prompt = `Genera 3 datos curiosos de historia universal, mitología griega o curiosidades botánicas para ${userName}. Deben ser datos raros, breves (máximo 4 líneas) y escritos en un tono amable. Devuélvelos en formato JSON estricto: [{"cat": "", "title": "", "body": "", "emoji": "", "catColor": ""}]. Para 'cat' usa solo 'griegos', 'plantas' o 'historia'. Para 'catColor' usa #534AB7 para griegos, #0F6E56 para plantas y #993C1D para historia.`;

    let response;
    try {
      response = await ai.models.generateContent({ 
        model: "gemini-1.5-flash-exp",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
    } catch (proError) {
      console.error("AI Error:", proError);
      throw proError;
    }

    const text = response.text;
    const data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

    return Response.json({ curiosities: data });
  } catch (error) {
    console.error("Knowledge API error:", error);
    return Response.json({ error: true, message: error.message }, { status: 500 });
  }
}
