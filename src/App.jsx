import React, { useEffect } from 'react';
import Layout from './components/ui/Layout';
import ChatWithAI from './components/features/ChatWithAI';
import Translator from './components/features/Translator';
import { debugEnvVars, checkRequiredEnvVars } from './utils/envUtils';
import { AlertCircle, MessageSquare, Languages } from 'lucide-react';

const App = () => {
  useEffect(() => {
    // Debug environment variables in development mode
    debugEnvVars();
    
    // Check if required environment variables are present
    const { allPresent, missingVars } = checkRequiredEnvVars();
    
    if (!allPresent) {
      console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }, []);
  
  return (
    <Layout>
      <div className="space-y-8">
        <header className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Assistant Platform</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Chat with AI and translate text using state-of-the-art language models
          </p>
        </header>
        
        <section className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">AI Chat Assistant</h2>
            </div>
            <ChatWithAI />
          </div>
          
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-indigo-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Language Translator</h2>
            </div>
            <Translator />
          </div>
        </section>
        
        <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">API Key Configuration</h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                Make sure your API keys are properly configured in the <code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded">.env</code> file.
                For security reasons, never commit this file to your Git repository. Use <code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded">.env.example</code> as a template.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default App;
