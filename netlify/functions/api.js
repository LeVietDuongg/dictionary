import express from 'express';
import serverless from 'serverless-http';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_API_KEY);

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

app.get('/api/dictionary/:word', async (req, res) => {
  try {
    const response = await axios.get(`${DICTIONARY_API}/${req.params.word}`);
    res.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).json({ error: 'Word not found in dictionary' });
    } else {
      res.status(500).json({ error: 'Failed to fetch dictionary data' });
    }
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: req.body.messages,
      temperature: 0.9,
      max_tokens: 150,
    });
    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text, fromLang, toLang } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Translate the following text from ${fromLang} to ${toLang}. Only provide the direct translation without any additional text or explanations:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ translation: response.text().trim() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to translate text' });
  }
});

export const handler = serverless(app);