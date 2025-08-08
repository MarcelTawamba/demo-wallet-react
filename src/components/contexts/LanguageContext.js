import React, { createContext, useContext, useState } from 'react';
import i18n from 'util/i18n';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const setLanguage = lang => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
  };
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
