
export type Category = 'food' | 'shopping' | 'transport' | 'entertainment' | 'housing' | 'utilities' | 'health' | 'other';

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'credit' | 'debit' | 'cash' | 'other';
  color?: string;
};

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  paymentMethod?: string;
  dueMonth?: string; // YYYY-MM format for credit card transactions
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'pt-BR';

export interface UserSettings {
  theme: ThemeMode;
  language: Language;
  spendingLimit: number;
}
