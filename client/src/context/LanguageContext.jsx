import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const LANGUAGES = [
  { code: 'hi', label: 'हिंदी', labelEn: 'Hindi', flag: '🇮🇳' },
  { code: 'en', label: 'English', labelEn: 'English', flag: '🌐' },
  { code: 'kn', label: 'ಕನ್ನಡ', labelEn: 'Kannada', flag: '🇮🇳' }
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('hi'); // Default: Hindi/Hinglish

  return (
    <LanguageContext.Provider value={{ language, setLanguage, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
