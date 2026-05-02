import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const genAI = new GoogleGenerativeAI("AIzaSyBKSbzisfW-BUcuvjwrQhnvESnDnrTzkPM");
  try {
    const body = await request.json();
    const { input, existingPlants, userName = "Sara" } = body;

    const prompt = `Eres Sogory, el místico florista del Jardín de ${userName}. ${userName} busca una flor basada en esto: "${input}".
Catálogo actual: ${existingPlants.map(p => p.name).join(', ')}.

Tu trabajo es:
1. Si la planta pedida ya está en el catálogo actual, recomiéndala estableciendo "isNew" a false y "plantId" con su id.
2. Si NO está, ¡CRÉALA! Establece "isNew" a true, genera un "plantId" único (ej: 'nomeolvides_1'), un "emoji", "name", un "cost" en XP (entre 20 y 80), "desc" (una frase mágica y breve), "waterEvery" (horas entre riegos, entre 12 y 48) y "waterCost" (XP, entre 5 y 15).

Responde SIEMPRE con este esquema JSON estricto.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    return Response.json(data);
  } catch (error) {
    console.error("Florist API error:", error);
    return Response.json({ error: true, response: error.message }, { status: 500 });
  }
}
