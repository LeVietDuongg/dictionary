import React, { useState } from 'react';
import { Book, Search, Volume2, Send, MessageSquare, Languages, Mic, Camera, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getDictionaryDefinition, getAIResponse, translateText, SUPPORTED_LANGUAGES } from './api';
import { DictionaryResponse, ChatMessage, Language } from './types';

function App() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [definitions, setDefinitions] = useState<DictionaryResponse[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  const [translationText, setTranslationText] = useState('');
  const [fromLang, setFromLang] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [toLang, setToLang] = useState<Language>(SUPPORTED_LANGUAGES[1]);
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  const handleSearch = async () => {
    if (!word.trim()) {
      toast.error('Please enter a word to search');
      return;
    }
    
    setLoading(true);
    setDefinitions([]);
    
    try {
      const defs = await getDictionaryDefinition(word);
      setDefinitions(defs);
      
      if (defs.length === 0) {
        toast.error('No definitions found');
      }
    } catch (error) {
      toast.error('Failed to find the word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setAiLoading(true);

    try {
      const aiResponse = await getAIResponse([...messages, newMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setAiLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!translationText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    setTranslating(true);
    try {
      const result = await translateText({
        text: translationText,
        fromLang: fromLang.name,
        toLang: toLang.name
      });
      setTranslatedText(result);
    } catch (error) {
      toast.error('Translation failed. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    new Audio(audioUrl).play().catch(() => {
      toast.error('Failed to play audio');
    });
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="glass-morphism sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Book className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">English Dictionary</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowTranslation(!showTranslation);
                  setShowChat(false);
                }}
                className={`btn ${showTranslation ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Languages className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setShowChat(!showChat);
                  setShowTranslation(false);
                }}
                className={`btn ${showChat ? 'btn-primary' : 'btn-secondary'}`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Dictionary Section */}
        <div className="max-w-3xl mx-auto">
          <div className="card mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Enter an English word..."
                  className="input-field pr-20"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-600">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-indigo-600">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn btn-primary flex items-center"
              >
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-1" />
                    Search
                  </>
                )}
              </button>
            </div>

            {definitions.map((def, index) => (
              <div key={index} className="mt-6 border-t border-gray-200/50 pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{def.word}</h2>
                  {def.phonetics.map((phonetic, idx) => (
                    phonetic.audio && (
                      <button
                        key={idx}
                        onClick={() => playAudio(phonetic.audio)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    )
                  ))}
                </div>

                {def.meanings.map((meaning, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      {meaning.partOfSpeech}
                    </h3>
                    <ul className="space-y-4">
                      {meaning.definitions.map((definition, defIdx) => (
                        <li key={defIdx} className="pl-4 border-l-2 border-indigo-200">
                          <p className="text-gray-800">{definition.definition}</p>
                          {definition.example && (
                            <p className="text-gray-600 mt-1 italic">
                              Example: {definition.example}
                            </p>
                          )}
                          {definition.synonyms.length > 0 && (
                            <p className="text-gray-600 mt-1">
                              Synonyms: {definition.synonyms.join(', ')}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Translation Sidebar */}
      <aside className={`sidebar ${showTranslation ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Translation</h2>
            <button
              onClick={() => setShowTranslation(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                value={fromLang.code}
                onChange={(e) => setFromLang(SUPPORTED_LANGUAGES.find(lang => lang.code === e.target.value) || SUPPORTED_LANGUAGES[0])}
                className="input-field"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                value={toLang.code}
                onChange={(e) => setToLang(SUPPORTED_LANGUAGES.find(lang => lang.code === e.target.value) || SUPPORTED_LANGUAGES[1])}
                className="input-field"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                value={translationText}
                onChange={(e) => setTranslationText(e.target.value)}
                placeholder="Enter text to translate..."
                className="input-field min-h-[100px]"
              />
            </div>
            <button
              onClick={handleTranslate}
              disabled={translating || !translationText.trim()}
              className="btn btn-secondary w-full"
            >
              {translating ? 'Translating...' : 'Translate'}
            </button>
            {translatedText && (
              <div className="mt-4 p-4 bg-gray-50/50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Translation:</h3>
                <p className="text-gray-800">{translatedText}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Chat Sidebar */}
      <aside className={`sidebar ${showChat ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">AI Assistant</h2>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-50/80 ml-8'
                    : 'bg-gray-50/80 mr-8'
                }`}
              >
                {message.content}
              </div>
            ))}
            {aiLoading && (
              <div className="bg-gray-50/80 p-4 rounded-lg mr-8">
                Thinking...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about translations, meanings, or usage..."
              className="input-field"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={aiLoading || !userInput.trim()}
              className="btn btn-primary"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;