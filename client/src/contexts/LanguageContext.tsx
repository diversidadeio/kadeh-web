import React, { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Language } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  getLocalizedPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  // Extract language from URL path
  const language = useMemo(() => {
    const pathSegments = location.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (firstSegment === 'pt' || firstSegment === 'en') {
      return firstSegment as Language;
    }
    
    return 'pt'; // Default to Portuguese
  }, [location]);

  // Helper function to convert paths to localized versions
  const getLocalizedPath = (path: string): string => {
    // Remove any existing language prefix
    let cleanPath = path;
    if (cleanPath.startsWith('/pt/') || cleanPath.startsWith('/en/')) {
      cleanPath = cleanPath.substring(3);
    }
    if (cleanPath === '/pt' || cleanPath === '/en') {
      cleanPath = '/';
    }
    
    // Add new language prefix
    if (cleanPath === '/' || cleanPath === '') {
      return `/${language}`;
    }
    return `/${language}${cleanPath}`;
  };

  return (
    <LanguageContext.Provider value={{ language, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
