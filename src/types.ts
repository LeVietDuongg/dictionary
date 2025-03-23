export interface DictionaryResponse {
  word: string;
  phonetics: {
    text: string;
    audio: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
  }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TranslationRequest {
  text: string;
  fromLang: string;
  toLang: string;
}

export type Language = {
  code: string;
  name: string;
};