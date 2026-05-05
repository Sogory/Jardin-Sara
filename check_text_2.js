const { GoogleGenAI } = require('@google/genai');

async function test() {
  const ai = new GoogleGenAI({ apiKey: 'AIzaSyBKSbzisfW-BUcuvjwrQhnvESnDnrTzkPM' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
