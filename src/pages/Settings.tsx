
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Languages, DollarSign } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { ThemeMode, Language } from '@/types';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const Settings = () => {
  const { t } = useTranslation();
  const { settings, updateTheme, updateLanguage, updateSpendingLimit } = useSettings();
  const [spendingLimit, setSpendingLimit] = useState(settings.spendingLimit.toString());

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('light'), icon: <Sun className="w-4 h-4 mr-2" /> },
    { value: 'dark', label: t('dark'), icon: <Moon className="w-4 h-4 mr-2" /> },
    { value: 'system', label: t('system'), icon: <Monitor className="w-4 h-4 mr-2" /> }
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'en', label: t('english') },
    { value: 'pt-BR', label: t('portuguese') }
  ];

  const handleSaveSpendingLimit = () => {
    const limit = parseFloat(spendingLimit);
    if (isNaN(limit) || limit <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    updateSpendingLimit(limit);
    toast.success(t('saveSuccess'));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 mt-16 page-transition fade-in">
        <div className="mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{t('settings')}</h1>
              <p className="text-muted-foreground">{t('personalizeApp')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Sun className="w-5 h-5 mr-2" />
              {t('appearance')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('theme')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateTheme(option.value)}
                      className={`flex items-center justify-center py-2 px-3 rounded-lg border ${
                        settings.theme === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card hover:bg-muted/50'
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <div className="flex items-center">
                    <Languages className="w-5 h-5 mr-2" />
                    {t('language')}
                  </div>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {languageOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateLanguage(option.value)}
                      className={`py-2 px-3 rounded-lg border ${
                        settings.language === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card hover:bg-muted/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4 slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              {t('financialSettings')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="spendingLimit" className="block text-sm font-medium text-foreground mb-1">
                  {t('monthlySpendingLimit')}
                </label>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('limitDescription')}
                </p>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      id="spendingLimit"
                      type="number"
                      value={spendingLimit}
                      onChange={(e) => setSpendingLimit(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      min="0"
                      step="1"
                    />
                  </div>
                  <button
                    onClick={handleSaveSpendingLimit}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {t('save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
