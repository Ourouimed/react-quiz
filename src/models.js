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
      },
      timeout: 10000, // 10 seconds timeout
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

  const parseResponse = (response) => response.data.candidates[0].content.parts[0].text.trim();

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

// DeepSeek AI
export const deepSeekAi = (prompt, setLoadingData, setError, setQuestions, NextQuestion) => {
  const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const API_URL = 'https://api.deepseek.com/v1/chat/completions';

  const payload = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    max_tokens: 1024,
  };

  const parseResponse = (response) =>
    response.data.choices[0].message?.content?.trim() || response.data.choices[0]?.text?.trim();

  return callAiApi({
    apiUrl: API_URL,
    apiKey: API_KEY,
    payload,
    parseResponse,
    setLoadingData,
    setError,
    setQuestions,
    NextQuestion,
  });
};

// OpenAI GPT-3.5 turbo
export const openAi = (prompt, setLoadingData, setError, setQuestions, NextQuestion) => {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024,
  };

  const parseResponse = (response) => response.data.choices[0].message.content.trim();

  return callAiApi({
    apiUrl: API_URL,
    apiKey: API_KEY,
    payload,
    parseResponse,
    setLoadingData,
    setError,
    setQuestions,
    NextQuestion,
  });
};
