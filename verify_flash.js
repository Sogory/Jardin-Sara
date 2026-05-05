const { GoogleGenAI } = require('@google/genai');

async function verify() {
  const ai = new GoogleGenAI({ apiKey: 'AIzaSyBKSbzisfW-BUcuvjwrQhnvESnDnrTzkPM' });
  const model = 'gemini-3.1-flash-lite-preview';
  
  console.log(`Testing model: ${model}`);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: 'Hola',
    });
    console.log('Success!');
    console.log('Response:', response.text);
  } catch (error) {
    console.error('Verification failed:', error.message);
  }
}

verify();
