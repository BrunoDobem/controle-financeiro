import React, { useState, useEffect } from 'react';
import { Transaction, Category } from '@/types';
import { useTransactions } from '@/context/TransactionsContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  transaction,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const { updateTransaction, paymentMethods } = useTransactions();
  const formatCurrency = useCurrencyFormat();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dueMonth, setDueMonth] = useState<string | undefined>(undefined);
  const [totalInstallments, setTotalInstallments] = useState<number>(1);

  const categories: Category[] = [
    'food', 'shopping', 'transport', 'entertainment',
    'housing', 'utilities', 'health', 'other'
  ];

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setCategory(transaction.category);
      setPaymentMethod(transaction.paymentMethod || '');
      setDueMonth(transaction.dueMonth);
      setTotalInstallments(transaction.totalInstallments || 1);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !date || !transaction) {
      toast.error(t('fillAllFields'));
      return;
    }
    
    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    const isCreditCard = selectedMethod?.type === 'credit';
    
    updateTransaction(transaction.id, {
      description,
      amount: parseFloat(amount),
      date,
      category,
      paymentMethod,
      dueMonth,
      totalInstallments: isCreditCard ? totalInstallments : undefined
    });
    
    toast.success(t('transactionUpdated'));
    onOpenChange(false);
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
  const isCreditCard = selectedMethod?.type === 'credit';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('editingTransaction')}: {formatCurrency(parseFloat(amount) || 0)}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t('description')}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('whatDidYouSpendOn')}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">{t('amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">{t('date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">{t('category')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(cat)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">{t('paymentMethod')}</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background"
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
          
          {isCreditCard && (
            <div>
              <label className="text-sm font-medium mb-1 block">{t('dueMonth')}</label>
              <input
                type="month"
                value={dueMonth}
                onChange={(e) => setDueMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
              />
            </div>
          )}
          
          {isCreditCard && (
            <div>
              <label className="text-sm font-medium mb-1 block">{t('installments')}</label>
              <select
                value={totalInstallments}
                onChange={(e) => setTotalInstallments(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}x {amount && `de ${formatCurrency(parseFloat(amount) / (i + 1))}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {isCreditCard && (
            <div className="text-sm text-muted-foreground">
              <p>{t('installmentInfo', { 
                total: formatCurrency(parseFloat(amount || '0')),
                installment: formatCurrency(parseFloat(amount || '0') / totalInstallments),
                count: totalInstallments
              })}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              {t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog; 