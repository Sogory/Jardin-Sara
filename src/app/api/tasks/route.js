import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const { task, context, userName = "Sara", userGender = "female" } = await request.json();
    const prompt = `TAREA: '${task}'\nCONTEXTO: '${context}'\n\nEres un Co-Ingeniero de Vida experto en desglosar tareas complejas en pasos accionables, simples y motivadores para ${userName}.
    REGLA DE GÉNERO: ${userName} es ${userGender === 'male' ? 'HOMBRE' : 'MUJER'}. Dirígete a ${userGender === 'male' ? 'él' : 'ella'} en ${userGender === 'male' ? 'masculino' : 'femenino'}.
    Si la tarea es demasiado vaga, pon "necesita_contexto": true y sugiere una "pregunta" para clarificar.
    Si es clara, devuelve "pasos" (array de strings).
    Devuelve SIEMPRE este JSON: {"necesita_contexto": boolean, "pregunta": string, "pasos": string[]}`;

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
