import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const { userName = "Sara" } = await request.json();
    const prompt = `Genera 3 datos curiosos de historia universal, mitología griega o curiosidades botánicas para ${userName}. Deben ser datos raros, breves (máximo 4 líneas) y escritos en un tono amable. Devuélvelos en formato JSON estricto: [{"cat": "", "title": "", "body": "", "emoji": "", "catColor": ""}]. Para 'cat' usa solo 'griegos', 'plantas' o 'historia'. Para 'catColor' usa #534AB7 para griegos, #0F6E56 para plantas y #993C1D para historia.`;

    let text;
    try {
      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: { responseMimeType: "application/json" },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    } catch (proError) {
      console.warn("Pro model failed, falling back to Flash:", proError.message);
      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    }

    const data = JSON.parse(text);

    return Response.json({ curiosities: data });
  } catch (error) {
    console.error("Knowledge API error:", error);
    return Response.json({ error: true, message: error.message }, { status: 500 });
  }
}
