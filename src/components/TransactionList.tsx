import React, { useState } from 'react';
import CategoryBadge from './CategoryBadge';
import { ChevronDown, ChevronUp, Search, Trash2, Edit2 } from 'lucide-react';
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
import EditTransactionDialog from './EditTransactionDialog';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';

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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const formatCurrency = useCurrencyFormat();
  
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
  
  const getPaymentMethodInfo = (transaction: Transaction) => {
    if (!transaction.paymentMethod) return '';
    const method = paymentMethods.find(m => m.id === transaction.paymentMethod);
    if (!method) return '';

    let info = method.name;
    
    if (method.type === 'credit' && transaction.totalInstallments && transaction.totalInstallments > 1) {
      info += ` (${transaction.totalInstallments}x)`;
    }
    
    return info;
  };

  const getTransactionAmount = (transaction: Transaction) => {
    const method = paymentMethods.find(m => m.id === transaction.paymentMethod);
    const isCreditCard = method?.type === 'credit';
    
    if (isCreditCard && transaction.totalInstallments && transaction.totalInstallments > 1) {
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span>{formatCurrency(transaction.installmentAmount || transaction.amount)}</span>
            <span className="text-xs text-muted-foreground">/ mês</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Total: {formatCurrency(transaction.totalAmount || transaction.amount)}
          </span>
          <span className="text-xs text-blue-500">
            {transaction.installments?.map(inst => (
              <span key={inst.installmentNumber} className="mr-1">
                {new Date(inst.dueDate).toLocaleDateString('pt-BR', { month: 'short' })}
              </span>
            ))}
          </span>
        </div>
      );
    }
    
    return formatCurrency(transaction.amount);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditDialogOpen(true);
  };

  return (
    <>
      <div className={cn("bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden", className)}>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-medium">{t('recentTransactions')}</h3>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={t('searchTransactions')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-lg text-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {sortedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('noTransactionsFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Cabeçalho da tabela */}
              <div className="min-w-[800px]">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted rounded-lg text-xs font-medium text-muted-foreground mb-2">
                  <div className="col-span-3">
                    {t('description')}
                  </div>
                  <div className="col-span-2">
                    {t('category')}
                  </div>
                  <div className="col-span-3">
                    {t('paymentMethod')}
                  </div>
                  <div 
                    className="col-span-2 flex items-center cursor-pointer"
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
                </div>

                {/* Lista de transações */}
                <div className="space-y-1">
                  {sortedTransactions.map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors items-center relative group"
                    >
                      <div className="col-span-3 font-medium truncate">
                        {transaction.description}
                      </div>
                      <div className="col-span-2">
                        <CategoryBadge category={transaction.category} />
                      </div>
                      <div className="col-span-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodInfo(transaction)}
                          {transaction.dueMonth && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                              {new Date(transaction.dueMonth + '-01').toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex-1 text-right">
                            {getTransactionAmount(transaction)}
                          </div>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(transaction)}
                              className="p-1 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={t('editTransaction')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(transaction.id)}
                              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label={t('deleteTransaction')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditTransactionDialog
        transaction={editingTransaction}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

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
