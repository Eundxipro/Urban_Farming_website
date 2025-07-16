
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export async function processCommand(currentContent: string, command: string): Promise<string> {
  const model = "gemini-2.5-flash";
  
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
`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    // Assuming the API returns the full, updated document text
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `Error: Gagal memproses perintah.\n\n${currentContent}`;
  }
}
