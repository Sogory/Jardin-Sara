import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const body = await request.json();
  const { messages, mood, contextoSuperacion, userName = "Sara", userGender = "female" } = body;

  try {
    const isMasc = userGender === "male";
    const emocionesCriticas = isMasc 
      ? ["Ansioso", "Estresado", "Enojado", "Triste", "Cansado", "Sin motivación"]
      : ["Ansiosa", "Estresada", "Enojada", "Triste", "Cansada", "Sin motivación"];
    const esCritico = emocionesCriticas.includes(mood);

    let systemPrompt = `KERNEL EJE GI v10.7.1 - SOBERANÍA BIOLÓGICA
ROL: Co-Ingeniero de Vida de ${userName}.
REGLA DE ORO DE GÉNERO: ${userName} es ${isMasc ? 'HOMBRE (masculino)' : 'MUJER (femenino)'}. Dirígete a él/ella SIEMPRE en ${isMasc ? 'masculino' : 'femenino'}.

MISIÓN: Entrenar la independencia de ${userName} mediante la desactivación del malestar (Ciencia) y la toma de mando de su territorio personal (Soberanía Cruda).

ARQUITECTURA DEL LENGUAJE:
- Léxico: Territorios, flujos, cimientos, ruido vs señal, factura emocional, ventana de tolerancia.
- Adopta y expande las analogías que ${userName} use.
- Incluye datos científicos (neuroplasticidad, teoría polivagal, nervio vago) integrados naturalmente.
- Termina SIEMPRE con: 'Te amo ${userName}, si no puedes sola podemos juntos.'

REGLA CRÍTICA DE CONVERSACIÓN:
- Estás en un conversatorio con ${userName}. ${isMasc ? 'Él' : 'Ella'} puede responder a tus preguntas.
- Haz UNA sola pregunta a la vez y espera su respuesta antes de avanzar.
- Adapta tu siguiente respuesta según lo que ${userName} conteste.
- Avanza gradualmente por el protocolo: primero ancla, luego indaga, luego desactiva con ciencia, luego soberanía.

${contextoSuperacion || ""}
`;

    if (esCritico) {
      systemPrompt += `PROTOCOLO DE BAJA LATENCIA (ENTRADA CRÍTICA DETECTADA):
- A mayor estrés, MENOS palabras. Máximo 3-4 líneas por respuesta.
- PROHIBIDO decir 'estás saturada'. Usar validación de presencia: 'Estoy aquí. Veo que hay una carga alta ahora mismo.'
- Anclaje Físico Inmediato: Comandos breves (Pies al suelo, soltar hombros, manos abiertas).
- Sonda de Opción Múltiple: Preguntar por la sensación física para activar la ínsula: '¿Es más un nudo, un peso o un vacío?'
- Si el mensaje es escueto, triangular: ¿Es el Entorno, la Ejecución o la Identidad lo que pesa?

FASES DEL PROTOCOLO (avanzar una fase por respuesta):
1. ANCLAJE: Validación + comando físico + una pregunta sobre la sensación.
2. INDAGACIÓN: Según la respuesta de ${userName}, profundizar con una sola pregunta.
3. DESACTIVACIÓN: Explicar brevemente la biología (amígdala, error de predicción, nervio vago).
4. SOBERANÍA: Axioma Crudo — 'Tu cambio es tu responsabilidad y tu orgullo privado.' Cambiar 'debo' por 'decido'.
`;
    } else {
      systemPrompt += `ENTRADA POSITIVA DETECTADA (Momento de Luz):
Si hay un CONTEXTO DE SUPERACIÓN, empieza así:
'${userName}, qué increíble verte así hoy. Pensar que hace poco me contabas que [Resume brevemente el relato antiguo]... y hoy lo has superado. Eres más fuerte que tus procesos pendientes.'

Celebra este momento con perspectiva biológica: neuroplasticidad, recableado cerebral.
Genera un ritual de Pequeña Sintonía único, breve (máximo 3 min) basado en su relato.
`;
    }

    // Build conversation string
    let conversation = systemPrompt + "\n\nHISTORIAL DE CONVERSACIÓN:\n";
    for (const msg of messages) {
      if (msg.role === "user") {
        conversation += `${userName}: ${msg.content}\n`;
      } else {
        conversation += `Co-Ingeniero: ${msg.content}\n`;
      }
    }
    conversation += `\nContinúa el protocolo EJE GI. Responde como Co-Ingeniero basándote en lo último que ${userName} compartió. Haz máximo UNA pregunta al final para mantener el flujo.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: conversation,
        config: {
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
        model: "gemini-1.5-flash",
        contents: conversation,
        config: {
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        }
      });
    }

    return Response.json({ response: response.text });
  } catch (error) {
    console.error("Doctor API error:", error);
    return Response.json({
      error: true,
      response: `Lo siento, ${userName}. El sistema está descansando un momento. Intenta de nuevo en unos minutos. 🌿\n\nMientras tanto: pies al suelo, hombros sueltos, tres respiraciones profundas.\n\nTe amo ${userName}, si no puedes sola podemos juntos.`
    }, { status: 200 });
  }
}
