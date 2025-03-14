
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTransactions } from '@/context/TransactionsContext';
import { useTranslation } from '@/hooks/useTranslation';

interface TransactionFormProps {
  className?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ className }) => {
  const { t } = useTranslation();
  const { addTransaction, paymentMethods } = useTransactions();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('other');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [dueMonth, setDueMonth] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);

  const categories: Category[] = [
    'food', 'shopping', 'transport', 'entertainment',
    'housing', 'utilities', 'health', 'other'
  ];

  // Effect to handle due month when payment method changes
  useEffect(() => {
    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    if (selectedMethod?.type === 'credit') {
      const currentDate = new Date();
      setDueMonth(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
    } else {
      setDueMonth(undefined);
    }
  }, [paymentMethod, paymentMethods]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !date) {
      toast.error(t('fillAllFields'));
      return;
    }
    
    addTransaction({
      description,
      amount: parseFloat(amount),
      date,
      category,
      paymentMethod,
      dueMonth,
    });
    
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('other');
    setPaymentMethod('cash');
    setDueMonth(undefined);
    setIsExpanded(false);
    
    toast.success(t('transactionAdded'));
  };
  
  // Helper function to get next month
  const getNextMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className={cn("bg-card rounded-xl shadow-sm border border-border/50", className)}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>{t('addNewTransaction')}</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 scale-in">
          <h3 className="text-lg font-medium mb-4">{t('newTransaction')}</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                {t('description')}
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('whatDidYouSpendOn')}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
                  {t('amount')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-foreground mb-1">
                  {t('date')}
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('category')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      `category-${cat} p-2 rounded-lg text-center text-xs capitalize transition-all`,
                      category === cat ? 'ring-2 ring-ring' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    {t(cat)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-foreground mb-1">
                {t('paymentMethod')}
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            
            {paymentMethods.find(m => m.id === paymentMethod)?.type === 'credit' && (
              <div>
                <label htmlFor="dueMonth" className="block text-sm font-medium text-foreground mb-1">
                  {t('dueMonth')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currentDate = new Date();
                      setDueMonth(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
                    }}
                    className={cn(
                      "p-2 rounded-lg text-center text-xs transition-all border",
                      dueMonth === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}` 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    {t('currentMonth')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDueMonth(getNextMonth())}
                    className={cn(
                      "p-2 rounded-lg text-center text-xs transition-all border",
                      dueMonth === getNextMonth() 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    {t('nextMonth')}
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t('addTransaction')}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TransactionForm;
