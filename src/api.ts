import axios from 'axios';
import { DictionaryResponse, ChatMessage, TranslationRequest } from './types';

// In production, this will be empty since we're serving from the same origin
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';

export const getDictionaryDefinition = async (word: string): Promise<DictionaryResponse[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dictionary/${word}`);
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
    const response = await axios.post(`${API_BASE_URL}/chat`, { messages });
    return response.data.content;
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error('Failed to get AI response');
  }
};

export const translateText = async ({ text, fromLang, toLang }: TranslationRequest): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/translate`, {
      text,
      fromLang,
      toLang
    });
    return response.data.translation;
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