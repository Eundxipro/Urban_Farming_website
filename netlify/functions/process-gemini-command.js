// netlify/functions/process-gemini-command.js
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Menggunakan GoogleGenerativeAI

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

  // --- BAGIAN PROMPT YANG SUDAH DIREVISI ---
  const prompt = `
Anda adalah asisten yang membantu dalam mengelola dokumen.
Tugas Anda adalah memperbarui atau merevisi "Konten Dokumen Saat Ini" berdasarkan "Perintah Pengguna".

---
Konten Dokumen Saat Ini:
${currentContent || '[Dokumen kosong]'}
---

---
Perintah Pengguna:
${command}
---

Instruksi:
- Ubah "Konten Dokumen Saat Ini" sesuai dengan "Perintah Pengguna".
- Hasil Anda harus HANYA TEKS DOKUMEN YANG TELAH DIREVISI.
- JANGAN sertakan komentar, pengantar, atau teks di luar dokumen revisi itu sendiri.
- JANGAN sertakan instruksi atau pertanyaan Anda sendiri tentang bagaimana Anda dapat membantu.
- Mulai langsung dengan teks dokumen yang direvisi.
`; // <-- String prompt yang sudah direvisi

  try {
    console.log('Calling Gemini API...'); 
    const apiCallStartTime = Date.now();
    const result = await geminiModel.generateContent(prompt);
    const apiCallEndTime = Date.now();
    console.log(`Gemini API call took: ${apiCallEndTime - apiCallStartTime}ms`);

    const response = await result.response;
    const updatedContent = response.text(); 

    const endTime = Date.now();
    console.log(`Function finished in: ${endTime - startTime}ms`);
    return {
      statusCode: 200,
      body: JSON.stringify({ updatedContent }),
    };
  } catch (error) {
    console.error("Error calling Gemini API from Netlify Function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server: Failed to process command: ${error.message || error}` }),
    };
  }
};