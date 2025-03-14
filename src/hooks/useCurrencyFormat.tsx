import { useSettings } from '@/context/SettingsContext';

export const useCurrencyFormat = () => {
  const { settings } = useSettings();

  const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat(settings.language === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: settings.language === 'pt-BR' ? 'BRL' : 'USD',
    });

    return formatter.format(value);
  };

  return formatCurrency;
}; 