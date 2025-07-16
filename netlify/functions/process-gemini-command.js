// netlify/functions/process-gemini-command.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  console.log('Function started'); // Log awal
  const startTime = Date.now();

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { currentContent, command, model } = JSON.parse(event.body);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Server: API Key not set in Netlify Environment'); // Log error di server
    return { statusCode: 500, body: JSON.stringify({ error: 'Server: API Key not set in Netlify Environment' }) };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model: model || "gemini-2.5-flash" });

  const prompt = `
Anda adalah asisten AI yang membantu dalam penyusunan dokumen.
Berdasarkan konten dokumen saat ini dan perintah pengguna, perbarui dokumen tersebut.
... (sisa prompt Anda) ...
`;

  try {
    console.log('Calling Gemini API...'); // Log sebelum panggilan API
    const apiCallStartTime = Date.now();
    const result = await geminiModel.generateContent(prompt);
    const apiCallEndTime = Date.now();
    console.log(`Gemini API call took: ${apiCallEndTime - apiCallStartTime}ms`); // Log durasi panggilan API

    const response = await result.response;
    const updatedContent = response.text();

    const endTime = Date.now();
    console.log(`Function finished in: ${endTime - startTime}ms`); // Log total durasi fungsi
    return {
      statusCode: 200,
      body: JSON.stringify({ updatedContent }),
    };
  } catch (error) {
    console.error("Error calling Gemini API from Netlify Function:", error); // Log error API Gemini
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server: Failed to process command: ${error.message || error}` }),
    };
  }
};