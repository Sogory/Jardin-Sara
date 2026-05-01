import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { task, context } = await request.json();

    let prompt;
    if (context) {
      // Second call: we have context from clarification
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

Devuelve JSON: {"pasos": ["paso1", "paso2", ...]}`;
    } else {
      // First call: evaluate if task is specific or vague
      prompt = `Eres el asistente de Sara para romper tareas en pasos pequeños y REALES.

TAREA: '${task}'

PASO 1 - EVALÚA si puedes dar pasos concretos:
- Si la tarea es ESPECÍFICA (ej: 'Redactar un informe', 'Lavar la ropa', 'Hacer la cama'), genera los pasos reales necesarios.
- Si la tarea es VAGA o AMPLIA (ej: 'Limpiar', 'Estudiar', 'Organizar'), haz UNA pregunta corta para saber qué parte exacta atacar.

REGLAS PARA LOS PASOS (solo si la tarea es específica):
- Genera entre 3 y 10 pasos según lo que la tarea REALMENTE necesite. No fuerces un número fijo.
- NO SALTES ningún paso crítico. Si una máquina se enciende, incluye 'Enciende la máquina'. Si hay que seleccionar un ciclo, inclúyelo.
- Piensa en la tarea completa de principio a fin: ¿qué haría una persona paso a paso en la vida real?
- Los pasos deben ser ACCIONES REALES que se puedan ejecutar con las manos o en una pantalla.
- Ejemplo para 'Lavar la ropa': ['Agarra la ropa sucia y llévala a la lavadora', 'Abre la tapa de la lavadora', 'Pon la ropa dentro del tambor', 'Echa el detergente', 'Cierra la tapa', 'Selecciona el ciclo de lavado', 'Presiona el botón de inicio']
- Ejemplo para 'Redactar un informe': ['Abre Word o Google Docs', 'Escribe el título del informe', 'Completa los datos de la portada', 'Escribe la idea principal en la introducción', 'Guarda el archivo']
- PROHIBIDO pasos vagos como 'Planifica', 'Piensa', 'Organiza tus ideas', 'Reflexiona'.
- Usa verbos directos: Abre, Escribe, Mueve, Agarra, Pon, Saca, Dobla, Cierra, Guarda, Lava, Barre, Enciende, Presiona, Selecciona.
- El primer paso es la acción física más pequeña para EMPEZAR.
- El último paso es una acción de CIERRE real de la tarea.
- Máximo 12 palabras por paso.

FORMATO DE RESPUESTA:
Si puedes dar pasos concretos (entre 3 y 10 pasos):
{"necesita_contexto": false, "pregunta": "", "pasos": ["paso1", "paso2", ...]}

Si la tarea es vaga y necesitas más info:
{"necesita_contexto": true, "pregunta": "¿Qué parte específica...?", "pasos": []}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text);
    return Response.json(data);
  } catch (error) {
    console.error("Tasks API error:", error);
    return Response.json({ error: "Error al procesar la tarea" }, { status: 500 });
  }
}
