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