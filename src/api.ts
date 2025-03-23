import axios from 'axios';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DictionaryResponse, ChatMessage, TranslationRequest } from './types';

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

const genAI = new GoogleGenerativeAI('AIzaSyBxZ6mFzF3uShotOIJhPGge_CO-SaTKtHc');

export const getDictionaryDefinition = async (word: string): Promise<DictionaryResponse[]> => {
  try {
    const response = await axios.get(`${DICTIONARY_API}/${word}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Word not found in dictionary');
    }
    throw new Error('Failed to fetch dictionary data');
  }
};

export const getAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.9,
      max_tokens: 150,
    });

    return completion.choices[0].message.content || 'No response from AI';
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error('Failed to get AI response');
  }
};

export const translateText = async ({ text, fromLang, toLang }: TranslationRequest): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Translate the following text from ${fromLang} to ${toLang}. Only provide the direct translation without any additional text or explanations:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Translation Error:', error);
    throw new Error('Failed to translate text');
  }
};

export const SUPPORTED_LANGUAGES: { code: string; name: string; }[] = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' }
];