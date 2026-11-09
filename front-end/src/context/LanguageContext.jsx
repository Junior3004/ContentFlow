import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'contentflow_locale';

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) {
      return saved;
    }
    return import.meta.env.VITE_DEFAULT_LOCALE || 'pt-BR';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
    }
  };

  const toggleLocale = () => {
    setLocaleState((prev) => (prev === 'pt-BR' ? 'en' : 'pt-BR'));
  };

  const t = (keyPath, params = {}) => {
    const keys = keyPath.split('.');
    let current = translations[locale] || translations['pt-BR'];
    for (const k of keys) {
      if (current && Object.prototype.hasOwnProperty.call(current, k)) {
        current = current[k];
      } else {
        return keyPath;
      }
    }
    if (typeof current !== 'string') {
      return current;
    }
    return Object.entries(params).reduce(
      (str, [paramKey, paramVal]) => str.replace(`{${paramKey}}`, String(paramVal)),
      current
    );
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat(locale).format(num || 0);
  };

  const formatDate = (isoString, includeTime = true) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    const options = includeTime
      ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat(locale, options).format(date);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        formatNumber,
        formatDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
