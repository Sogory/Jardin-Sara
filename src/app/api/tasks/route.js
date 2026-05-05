import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const { task, context, userName = "Sara", userGender = "female" } = await request.json();
    const prompt = `TAREA: '${task}'\nCONTEXTO: '${context}'\n\nEres un Co-Ingeniero de Vida experto en desglosar tareas complejas en pasos accionables, simples y motivadores para ${userName}.
    REGLA DE GÉNERO: ${userName} es ${userGender === 'male' ? 'HOMBRE' : 'MUJER'}. Dirígete a ${userGender === 'male' ? 'él' : 'ella'} en ${userGender === 'male' ? 'masculino' : 'femenino'}.
    Si la tarea es demasiado vaga, por "necesita_contexto": true y sugiere una "pregunta" para clarificar.
    Si es clara, devuelve "pasos" (array de strings).
    Devuelve SIEMPRE este JSON: {"necesita_contexto": boolean, "pregunta": string, "pasos": string[]}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpiar posibles bloques de código markdown
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return Response.json(data);
  } catch (error) {
    console.error("Tasks API error:", error);
    return Response.json({ error: true, response: error.message }, { status: 500 });
  }
}
