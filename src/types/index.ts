export type Category = 'food' | 'shopping' | 'transport' | 'entertainment' | 'housing' | 'utilities' | 'health' | 'other';

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'credit' | 'debit' | 'cash' | 'other';
  color?: string;
};

export type CreditCardInstallment = {
  installmentNumber: number;
  amount: number;
  dueDate: string;
};

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  paymentMethod?: string;
  dueMonth?: string; // YYYY-MM format for credit card transactions
  installments?: CreditCardInstallment[];
  totalInstallments?: number;
  installmentAmount?: number; // Valor de cada parcela
  totalAmount?: number; // Valor total da compra
  originalTransactionId?: string; // Para agrupar parcelas da mesma compra
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'pt-BR';

export interface UserSettings {
  theme: ThemeMode;
  language: Language;
  spendingLimit: number;
}
