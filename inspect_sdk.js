const genai = require('@google/genai');
console.log('Keys of @google/genai:', Object.keys(genai));
if (genai.genai) {
    console.log('Keys of genai.genai:', Object.keys(genai.genai));
}
