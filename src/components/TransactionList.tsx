
import React, { useState } from 'react';
import CategoryBadge from './CategoryBadge';
import { ChevronDown, ChevronUp, Search, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types';
import { useTransactions } from '@/context/TransactionsContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from '@/hooks/useTranslation';

interface TransactionListProps {
  className?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ className }) => {
  const { t } = useTranslation();
  const { transactions, deleteTransaction, paymentMethods } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  const handleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t(transaction.category).toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      toast.success(t('transactionDeleted'));
      setTransactionToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  const getPaymentMethodName = (id?: string) => {
    if (!id) return '';
    const method = paymentMethods.find(m => m.id === id);
    return method ? method.name : '';
  };
  
  return (
    <>
      <div className={cn("bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden", className)}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{t('recentTransactions')}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={t('searchTransactions')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-lg text-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          
          <div className="overflow-hidden">
            {sortedTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('noTransactionsFound')}</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted rounded-lg text-xs font-medium text-muted-foreground mb-2">
                  <div className="col-span-4">
                    {t('description')}
                  </div>
                  <div className="col-span-2">
                    {t('category')}
                  </div>
                  <div className="col-span-2">
                    {t('paymentMethod')}
                  </div>
                  <div 
                    className="col-span-1 flex items-center cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    {t('date')}
                    {sortBy === 'date' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-3 h-3 ml-1" /> : 
                        <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </div>
                  <div 
                    className="col-span-2 text-right flex items-center justify-end cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    {t('amount')}
                    {sortBy === 'amount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-3 h-3 ml-1" /> : 
                        <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </div>
                  <div className="col-span-1"></div>
                </div>
                
                <div className="space-y-2">
                  {sortedTransactions.map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className="grid grid-cols-12 gap-2 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors"
                      style={{ 
                        animationDelay: `${index * 0.05}s`, 
                        animationFillMode: 'backwards' 
                      }}
                    >
                      <div className="col-span-4 font-medium truncate">{transaction.description}</div>
                      <div className="col-span-2">
                        <CategoryBadge category={transaction.category} />
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {getPaymentMethodName(transaction.paymentMethod)}
                        {transaction.dueMonth && (
                          <span className="ml-1 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-1 rounded">
                            {new Date(transaction.dueMonth + '-01').toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="col-span-1 text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        ${transaction.amount.toFixed(2)}
                      </div>
                      <div className="col-span-1 flex justify-end items-center">
                        <button
                          onClick={() => handleDeleteClick(transaction.id)}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label={t('deleteTransaction')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTransaction')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('no')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              {t('yes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionList;
