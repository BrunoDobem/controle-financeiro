import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, PaymentMethod } from '@/types';

// Sample data generator
const generateSampleTransactions = (): Transaction[] => {
  const categories: Category[] = ['food', 'shopping', 'transport', 'entertainment', 'housing', 'utilities', 'health', 'other'];
  const descriptions = [
    'Grocery shopping', 'Monthly rent', 'Uber ride', 'Movie tickets', 
    'Electricity bill', 'New shoes', 'Dinner with friends', 'Doctor visit',
    'Phone bill', 'Gym membership', 'Office supplies', 'Coffee'
  ];
  
  return Array.from({ length: 20 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `tr-${i}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      date: date.toISOString().split('T')[0],
      category: categories[Math.floor(Math.random() * categories.length)],
      paymentMethod: 'cash' // Default payment method
    };
  });
};

// Default payment methods
const defaultPaymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', type: 'cash', color: '#22c55e' },
  { id: 'debit', name: 'Debit Card', type: 'debit', color: '#3b82f6' },
  { id: 'credit', name: 'Credit Card', type: 'credit', color: '#ef4444' },
];

interface TransactionsContextType {
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (id: string) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    return savedPaymentMethods ? JSON.parse(savedPaymentMethods) : defaultPaymentMethods;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: `tr-${Date.now()}`,
      ...transaction
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...transaction, id } : t
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addPaymentMethod = (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    const newPaymentMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      ...paymentMethod
    };
    
    setPaymentMethods(prev => [...prev, newPaymentMethod]);
  };

  const deletePaymentMethod = (id: string) => {
    // Don't allow deleting if transactions use this payment method
    const inUse = transactions.some(transaction => transaction.paymentMethod === id);
    if (inUse) {
      throw new Error('Cannot delete payment method that is in use');
    }
    
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return (
    <TransactionsContext.Provider 
      value={{ 
        transactions, 
        paymentMethods,
        addTransaction, 
        updateTransaction,
        deleteTransaction,
        addPaymentMethod,
        deletePaymentMethod
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
