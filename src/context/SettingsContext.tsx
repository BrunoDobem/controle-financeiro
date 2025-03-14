
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, Language, UserSettings } from '@/types';

// Default settings
const defaultSettings: UserSettings = {
  theme: 'system',
  language: 'en',
  spendingLimit: 2000,
};

interface SettingsContextType {
  settings: UserSettings;
  updateTheme: (theme: ThemeMode) => void;
  updateLanguage: (language: Language) => void;
  updateSpendingLimit: (limit: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings]);

  const updateTheme = (theme: ThemeMode) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const updateLanguage = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const updateSpendingLimit = (limit: number) => {
    setSettings(prev => ({ ...prev, spendingLimit: limit }));
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        updateTheme, 
        updateLanguage, 
        updateSpendingLimit 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
