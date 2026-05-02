import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const { task, context, userName = "Sara" } = await request.json();
    const prompt = `TAREA: '${task}'\nCONTEXTO: '${context}'\n\nEres un Co-Ingeniero de Vida experto en desglosar tareas complejas en pasos accionables, simples y motivadores para ${userName}.
    Si la tarea es demasiado vaga, pon "necesita_contexto": true y sugiere una "pregunta" para clarificar.
    Si es clara, devuelve "pasos" (array de strings).
    Devuelve SIEMPRE este JSON: {"necesita_contexto": boolean, "pregunta": string, "pasos": string[]}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        }
      });
    } catch (proError) {
      console.warn("Pro model failed, falling back to Flash Lite:", proError.message);
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        }
      });
    }

    const data = JSON.parse(response.text);
    return Response.json(data);
  } catch (error) {
    console.error("Tasks API error:", error);
    return Response.json({
      error: true,
      message: "API Error: " + error.message,
      necesita_contexto: false,
      pasos: []
    });
  }
}
