import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { task, context } = await request.json();
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

    let prompt = context 
      ? `Sara necesita romper esta tarea: '${task}'. Detalle: '${context}'. Genera pasos reales y concretos.`
      : `Eres el asistente de Sara. Tarea: '${task}'. Rompela en pasos pequeños y reales. Si es vaga, haz una pregunta corta.`;

    prompt += `\nResponde en JSON: {"necesita_contexto": boolean, "pregunta": string, "pasos": string[]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // El SDK con responseMimeType ya debería dar JSON limpio
    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    console.error("Tasks API error:", error);
    return Response.json({ 
      error: true,
      message: "La IA está descansando. Intenta de nuevo.",
      necesita_contexto: false,
      pasos: []
    });
  }
}
