const { genai } = require('@google/genai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const client = new genai.Client({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await client.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hola'
    });
    console.log('Response:', response.text());
  } catch (error) {
    console.error('Error with genai.Client:', error.message);
  }
}

test();
