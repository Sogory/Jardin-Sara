import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hola",
    });
    console.log("Response:", response.text);
  } catch (error) {
    console.error("Error with GoogleGenAI:", error.message);
  }
}

test();
