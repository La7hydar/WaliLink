import { ReactNode } from 'react';
import { LanguageContext, useLanguageSetup } from '../hooks/useLanguage';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const languageValue = useLanguageSetup();

  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  );
}