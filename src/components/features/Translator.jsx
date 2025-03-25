import React, { useState, useEffect } from 'react';
import { translateText, getAvailableLanguages, verifyGoogleKey } from '../../services/translationService';
import { RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(true);

  useEffect(() => {
    // Check if API key is valid
    const isValid = verifyGoogleKey();
    setApiKeyValid(isValid);
    
    if (!isValid) {
      setError('Google API key is missing or invalid. Please check your .env file.');
      return;
    }

    // Load available languages
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        const languageList = await getAvailableLanguages();
        setLanguages(languageList);
      } catch (err) {
        setError('Failed to load languages. Please check your Google API key.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguages();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      setError('');
      const result = await translateText(inputText, targetLanguage, sourceLanguage === 'auto' ? '' : sourceLanguage);
      setOutputText(result);
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (e.target.value === '') {
      setOutputText('');
    }
  };

  const swapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

  if (!apiKeyValid) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-medium">API Key Configuration Error</h3>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          The Google API key is missing or invalid. Please check your .env file and ensure it contains a valid VITE_GOOGLE_API_KEY.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800/30">
        <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Text Translator</h2>
        <p className="text-sm text-indigo-600 dark:text-indigo-400">Translate text between different languages</p>
      </div>

      <div className="p-6">
        {/* Language Selection */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
            <select 
              value={sourceLanguage} 
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={isLoading || languages.length === 0}
            >
              <option value="auto">Detect Language</option>
              {languages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={swapLanguages}
            disabled={sourceLanguage === 'auto' || isLoading}
            className="mt-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-50"
            title={sourceLanguage === 'auto' ? 'Cannot swap when source is set to auto-detect' : 'Swap languages'}
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
            <select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={isLoading || languages.length === 0}
            >
              {languages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Text</label>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter text to translate..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Translation</label>
            <textarea
              value={outputText}
              readOnly
              className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
              placeholder="Translation will appear here..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Translating...
              </>
            ) : (
              'Translate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Translator;
