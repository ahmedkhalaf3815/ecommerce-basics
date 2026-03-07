const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { createOpenAI } = require('@ai-sdk/openai');
const { createGroq } = require('@ai-sdk/groq');

try {
    createGoogleGenerativeAI({ apiKey: undefined })();
} catch (e) { console.log('Google:', e.message); }

try {
    createOpenAI({ apiKey: '' })();
} catch (e) { console.log('OpenAI:', e.message); }

try {
    createGroq({ apiKey: '' })();
} catch (e) { console.log('Groq:', e.message); }
