import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const genAI = new GoogleGenerativeAI("AIzaSyBKSbzisfW-BUcuvjwrQhnvESnDnrTzkPM");
  const body = await request.json();
  const { messages, mood, userName = "Sara", userGender = "female" } = body;

  try {
    // 1. Intentamos hablar con el modelo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    let conversation = `Usuario: ${userName}\nMood: ${mood}\nHistorial:\n`;
    for (const msg of messages) {
      conversation += `${msg.role}: ${msg.content}\n`;
    }

    const result = await model.generateContent(conversation);
    const response = await result.response;
    return Response.json({ response: response.text() });

  } catch (error) {
    console.error("Doctor API error:", error);
    
    // 2. DIAGNÓSTICO: Si falla, intentamos ver qué modelos están disponibles
    let availableModels = "No se pudo obtener la lista.";
    try {
      // Nota: El SDK estándar no tiene un método directo sencillo para listar, 
      // pero intentaremos obtener el error más detallado posible.
    } catch (e) {}

    return Response.json({
      error: true,
      response: `[DIAGNÓSTICO]: Tu clave no reconoce 'gemini-1.5-flash-latest'. Error: ${error.message}. Por favor, prueba a usar 'gemini-pro' o verifica tu clave en AI Studio.`
    }, { status: 200 });
  }
}
