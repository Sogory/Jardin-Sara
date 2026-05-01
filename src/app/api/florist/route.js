import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Type } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const { input, existingPlants } = await request.json();
    
    const prompt = `Eres Sogory, el místico florista del Jardín de Sara. Sara busca una flor basada en esto: "${input}".
Catálogo actual: ${existingPlants.map(p => p.name).join(', ')}.

Tu trabajo es:
1. Si la planta pedida ya está en el catálogo actual, recomiéndala estableciendo "isNew" a false y "plantId" con su id.
2. Si NO está, ¡CRÉALA! Establece "isNew" a true, genera un "plantId" único (ej: 'nomeolvides_1'), un "emoji", "name", un "cost" en XP (entre 20 y 80), "desc" (una frase mágica y breve), "waterEvery" (horas entre riegos, entre 12 y 48) y "waterCost" (XP, entre 5 y 15).

Responde SIEMPRE con este esquema JSON estricto.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            msg: { type: Type.STRING, description: "Mensaje de Sogory para Sara" },
            isNew: { type: Type.BOOLEAN },
            plantId: { type: Type.STRING },
            newPlant: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                emoji: { type: Type.STRING },
                name: { type: Type.STRING },
                cost: { type: Type.INTEGER },
                desc: { type: Type.STRING },
                waterEvery: { type: Type.INTEGER },
                waterCost: { type: Type.INTEGER }
              }
            }
          },
          required: ["msg", "isNew", "plantId"]
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    const data = JSON.parse(response.text);
    return Response.json(data);
  } catch (error) {
    console.error("Florist API error:", error);
    return Response.json({ 
      error: true,
      msg: "Sogory está en el bosque buscando semillas, intenta de nuevo."
    });
  }
}
