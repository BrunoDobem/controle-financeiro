
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { Wallet } from 'lucide-react';
import { useTransactions } from '@/context/TransactionsContext';
import { useTranslation } from '@/hooks/useTranslation';

const Transactions = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 mt-16">
        <div className="mb-6 page-transition fade-in">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{t('transactions')}</h1>
              <p className="text-muted-foreground">{t('trackSpending')}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <TransactionList />
          </div>
          
          <div className="slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <TransactionForm className="sticky top-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
