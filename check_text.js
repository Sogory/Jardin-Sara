const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hola'
    });
    console.log('Response type:', typeof response.text);
    if (typeof response.text === 'function') {
        console.log('Response text():', response.text());
    } else {
        console.log('Response text:', response.text);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
