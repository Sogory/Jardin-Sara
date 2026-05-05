const { genai } = require('@google/genai');
const client = new genai.Client({ apiKey: 'AIzaSyBKSbzisfW-BUcuvjwrQhnvESnDnrTzkPM' });

client.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Hello'
}).then(res => {
    print(res.text());
}).catch(err => {
    console.error(err);
});
