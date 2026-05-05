import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await request.json();
  const { messages, mood, userName = "Sara", userGender = "female" } = body;

  // Lista de modelos para probar en orden de prioridad
  const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      let conversation = `Usuario: ${userName}\nGénero: ${userGender}\nMood: ${mood}\n\n`;
      for (const msg of messages) {
        conversation += `${msg.role === 'user' ? userName : 'Co-Ingeniero'}: ${msg.content}\n`;
      }
      conversation += "\nResponde como Co-Ingeniero. Máximo UNA pregunta al final.";

      const result = await model.generateContent(conversation);
      const response = await result.response;
      const text = response.text();

      return Response.json({ 
        response: text,
        debug_model: modelName // Para saber cuál funcionó
      });

    } catch (error) {
      console.warn(`Falló el modelo ${modelName}:`, error.message);
      lastError = error;
      // Si es un error de cuota (429) o no encontrado (404), seguimos al siguiente
      continue;
    }
  }

  // Si llegamos aquí, todos fallaron
  return Response.json({
    error: true,
    response: `[AGOTADO]: Todos los modelos fallaron. El último error fue: ${lastError.message}. Por favor, revisa tu cuota en Google AI Studio.`
  }, { status: 200 });
}
