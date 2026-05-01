import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { task, context } = await request.json();

    let prompt;
    if (context) {
      prompt = `Sara necesita romper esta tarea en pasos: '${task}'
Sara especificó este detalle: '${context}'

Genera entre 3 y 10 pasos REALES y CONCRETOS que Sara pueda ejecutar ahora mismo.
- Usa la cantidad de pasos que la tarea REALMENTE necesite, no un número fijo.
- NO SALTES ningún paso crítico (encender máquinas, seleccionar opciones, etc).
- Acciones físicas ejecutables AHORA, no motivacionales.
- Verbos directos: Abre, Escribe, Mueve, Agarra, Pon, Saca, Dobla, Cierra, Guarda, Lava, Barre, Enciende, Presiona, Selecciona.
- El primer paso es la acción más pequeña para empezar.
- El último paso es una acción de cierre real.
- Máximo 12 palabras por paso.

Responde SOLO con JSON válido, sin markdown, sin backticks.
Formato: {"pasos": ["paso1", "paso2", ...]}`;
    } else {
      prompt = `Eres el asistente de Sara para romper tareas en pasos pequeños y REALES.

TAREA: '${task}'

PASO 1 - EVALÚA si puedes dar pasos concretos:
- Si la tarea es ESPECÍFICA (ej: 'Redactar un informe', 'Lavar la ropa', 'Hacer la cama'), genera los pasos reales necesarios.
- Si la tarea es VAGA o AMPLIA (ej: 'Limpiar', 'Estudiar', 'Organizar'), haz UNA pregunta corta para saber qué parte exacta atacar.

REGLAS PARA LOS PASOS (solo si la tarea es específica):
- Genera entre 3 y 10 pasos según lo que la tarea REALMENTE necesite. No fuerces un número fijo.
- NO SALTES ningún paso crítico. Si una máquina se enciende, incluye 'Enciende la máquina'. Si hay que seleccionar un ciclo, inclúyelo.
- Piensa en la tarea completa de principio a fin.
- Los pasos deben ser ACCIONES REALES que se puedan ejecutar con las manos o en una pantalla.
- PROHIBIDO pasos vagos como 'Planifica', 'Piensa', 'Organiza tus ideas', 'Reflexiona'.
- Usa verbos directos: Abre, Escribe, Mueve, Agarra, Pon, Saca, Dobla, Cierra, Guarda, Lava, Barre, Enciende, Presiona, Selecciona.
- El primer paso es la acción física más pequeña para EMPEZAR.
- El último paso es una acción de CIERRE real de la tarea.
- Máximo 12 palabras por paso.

Responde SOLO con JSON válido, sin markdown, sin backticks.
Si puedes dar pasos concretos (entre 3 y 10 pasos):
{"necesita_contexto": false, "pregunta": "", "pasos": ["paso1", "paso2", ...]}

Si la tarea es vaga y necesitas más info:
{"necesita_contexto": true, "pregunta": "¿Qué parte específica...?", "pasos": []}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // Clean response text - remove markdown backticks if present
    let text = response.text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    console.error("Tasks API error:", error.message || error);
    const msg = String(error.message || "");
    const isQuota = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
    return Response.json({ 
      error: true,
      message: isQuota 
        ? "La IA está descansando (límite temporal). Intenta en 1 minuto." 
        : "Error al conectar con la IA. Intenta de nuevo.",
      necesita_contexto: false,
      pasos: []
    }, { status: 200 });
  }
}
