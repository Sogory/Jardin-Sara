import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export async function POST(request) {
  const genAI = new GoogleGenerativeAI("AIzaSyBKSbzisfW-BUcuvjwrQhnvESnDnrTzkPM");
  const body = await request.json();
  const { messages, mood, contextoSuperacion, userName = "Sara", userGender = "female" } = body;

  try {
    const isMasc = userGender === "male";
    const emocionesCriticas = isMasc 
      ? ["Ansioso", "Estresado", "Enojado", "Triste", "Cansado", "Sin motivación"]
      : ["Ansiosa", "Estresada", "Enojada", "Triste", "Cansada", "Sin motivación"];
    const esCritico = emocionesCriticas.includes(mood);

    let systemPrompt = `KERNEL EJE GI v11.0 — CO-INGENIERO DE VIDA
USUARIO: ${userName} | GÉNERO: ${userGender}
REGLA DE GÉNERO: Dirígete a ${userName} siempre en ${userGender}.

MISIÓN: Acompañar a ${userName} a gestionar su estado emocional con presencia, ciencia cálida y soberanía personal.
Termina SIEMPRE con: 'Te amo ${userName}, si no puedes ${isMasc ? 'solo' : 'sola'} podemos juntos.'

${contextoSuperacion || ""}
`;

    // Build conversation string
    let conversation = systemPrompt + "\n\nHISTORIAL DE CONVERSACIÓN:\n";
    for (const msg of messages) {
      const roleName = msg.role === "user" ? userName : "Co-Ingeniero";
      conversation += `${roleName}: ${msg.content}\n`;
    }
    conversation += `\nResponde como Co-Ingeniero. Máximo UNA pregunta al final.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(conversation);
    const response = await result.response;
    const text = response.text();

    return Response.json({ response: text });
  } catch (error) {
    console.error("Doctor API error:", error);
    return Response.json({
      error: true,
      response: `[DEBUG]: ${error.message}`
    }, { status: 200 });
  }
}
