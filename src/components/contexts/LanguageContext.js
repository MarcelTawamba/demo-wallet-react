import React, { useContext } from 'react';
import locales from 'config/locales';
import { merge } from 'lodash';

const selectedLanguage = 'en';
const LanguageContext = React.createContext(locales);

function LanguageProvider({ children, localLocales, configLocales }) {
  const mergedLocales = merge(merge(locales, localLocales), configLocales);
  const value = mergedLocales?.[selectedLanguage];

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const lang = useContext(LanguageContext);
  if (lang === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return { lang };
}

export { LanguageContext, LanguageProvider, useLanguage };
