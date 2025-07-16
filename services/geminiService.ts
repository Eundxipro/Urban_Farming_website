// services/geminiService.ts
// import { GoogleGenAI } from "@google/genai"; // <-- HAPUS IMPOR INI DARI SISI CLIENT
// const apiKey = process.env.API_KEY; // <-- HAPUS BARIS INI DARI SISI CLIENT
// if (!apiKey) { ... } // <-- HAPUS BLOK INI DARI SISI CLIENT
// const ai = new GoogleGenAI({ apiKey }); // <-- HAPUS BARIS INI DARI SISI CLIENT

export async function processCommand(currentContent: string, command: string): Promise<string> {
  // Data yang akan dikirim ke fungsi Netlify Anda
  const requestBody = {
    currentContent: currentContent,
    command: command,
    model: "gemini-2.5-flash" // Atau model lainnya
  };

  try {
    // Panggil Netlify Function Anda
    const response = await fetch('/.netlify/functions/process-gemini-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return data.updatedContent; // Asumsikan fungsi Netlify mengembalikan updatedContent
  } catch (error) {
    console.error("Error calling Netlify Function for Gemini API:", error);
    return `Error: Gagal memproses perintah (server error).\n\n${currentContent}`;
  }
}