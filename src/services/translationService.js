/**
 * Google Translation API service
 * Handles communication with Google API for translation functionality
 */
export async function translateText(text, targetLanguage, sourceLanguage = '') {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please check your .env file.');
  }
  
  try {
    const url = new URL('https://translation.googleapis.com/language/translate/v2');
    url.searchParams.append('key', apiKey);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        ...(sourceLanguage && { source: sourceLanguage }),
        format: 'text'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Translate API error:', errorData);
      throw new Error(`Google Translation API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

export function verifyGoogleKey() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  return Boolean(apiKey && apiKey.length > 20);
}

export async function getAvailableLanguages() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please check your .env file.');
  }
  
  try {
    const url = new URL('https://translation.googleapis.com/language/translate/v2/languages');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('target', 'en'); // Get language names in English
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.languages;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
}
