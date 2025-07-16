// netlify/functions/process-gemini-command.js
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Menggunakan GoogleGenerativeAI

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { currentContent, command, model } = JSON.parse(event.body);

  // API Key harus diatur sebagai Environment Variable di Netlify (Site settings -> Environment)
  const apiKey = process.env.GEMINI_API_KEY; 
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server: API Key not set in Netlify Environment' }) };
  }

  const genAI = new GoogleGenerativeAI(apiKey); // Inisialisasi genAI
  const geminiModel = genAI.getGenerativeModel({ model: model || "gemini-2.5-flash" }); // Ambil model dari client atau default

  const prompt = `
Anda adalah asisten AI yang membantu dalam penyusunan dokumen.
Berdasarkan konten dokumen saat ini dan perintah pengguna, perbarui dokumen tersebut.

Perintah Pengguna: "${command}"

Konten Dokumen Saat Ini:
---
${currentContent || 'Dokumen masih kosong.'}
---

Instruksi:
- Analisis perintah pengguna dan konten saat ini.
- Ubah konten dokumen sesuai dengan perintah.
- Jika perintahnya adalah untuk meringkas, gantilah konten saat ini dengan ringkasannya.
- Jika perintahnya adalah untuk melanjutkan, tambahkan kelanjutan yang relevan pada konten yang ada.
- Jika perintahnya untuk memperbaiki tata bahasa, perbaiki kesalahan dalam teks yang ada.
- Untuk perintah umum lainnya, gunakan penilaian terbaik Anda untuk memodifikasi dokumen secara membantu.
- Kembalikan HANYA teks dokumen lengkap yang telah direvisi dalam format plain text. JANGAN sertakan markdown, komentar, atau teks pengantar apa pun di luar dokumen itu sendiri.
`; // <-- Template literal DITUTUP DI SINI

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const updatedContent = response.text(); // Ambil teks dari respons Gemini

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
}; // <-- Kurung kurawal penutup untuk exports.handler