import axios from "axios";

const callAiApi = async ({
  apiUrl,
  apiKey,
  payload,
  headers = {},
  parseResponse,
  setLoadingData,
  setError,
  setQuestions,
  NextQuestion
}) => {
  setLoadingData(true);
  setError('');

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        ...headers,
      }
    });
    const content = parseResponse(response);
    const parsedQuestions = JSON.parse(content);
    if (!Array.isArray(parsedQuestions)) throw new Error('Response is not an array');
    
    setQuestions(parsedQuestions);
    NextQuestion();

  } catch (err) {
    console.error("AI API error:", err);
    setError('Error: Invalid or unclear topic provided.');
  } finally {
    setLoadingData(false);
  }
};

// Gemini AI
export const geminiAi = (prompt, setLoadingData, setError, setQuestions, NextQuestion) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  const parseResponse = (response) => response.data.candidates[0].content.parts[0].text.replace(/```[\s\S]*?\n/, '').replace(/```$/, '').trim();

  return callAiApi({
    apiUrl: API_URL,
    payload,
    parseResponse,
    setLoadingData,
    setError,
    setQuestions,
    NextQuestion,
  });
};

