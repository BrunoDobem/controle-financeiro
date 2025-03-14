
import React, { useState } from 'react';
import Header from '@/components/Header';
import { CreditCard, PlusCircle, Trash2 } from 'lucide-react';
import { useTransactions } from '@/context/TransactionsContext';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types';
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

const PaymentMethods = () => {
  const { t } = useTranslation();
  const { paymentMethods, addPaymentMethod, deletePaymentMethod } = useTransactions();
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodType, setNewMethodType] = useState<'credit' | 'debit' | 'cash' | 'other'>('debit');
  const [newMethodColor, setNewMethodColor] = useState('#3b82f6');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMethodName.trim()) {
      toast.error(t('fillAllFields'));
      return;
    }
    
    addPaymentMethod({
      name: newMethodName,
      type: newMethodType,
      color: newMethodColor
    });
    
    // Reset form
    setNewMethodName('');
    setNewMethodType('debit');
    setNewMethodColor('#3b82f6');
    setIsAddingMethod(false);
    
    toast.success(t('methodAdded'));
  };

  const handleDeleteClick = (id: string) => {
    setMethodToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!methodToDelete) {
      setDeleteDialogOpen(false);
      return;
    }
    
    try {
      deletePaymentMethod(methodToDelete);
      toast.success(t('methodDeleted'));
    } catch (error) {
      toast.error(t('cannotDeleteInUse'));
    }
    
    setMethodToDelete(null);
    setDeleteDialogOpen(false);
  };

  const typeOptions = [
    { value: 'credit', label: t('credit') },
    { value: 'debit', label: t('debit') },
    { value: 'cash', label: t('cash') },
    { value: 'other', label: t('other') }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 mt-16 page-transition fade-in">
        <div className="mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{t('paymentMethods')}</h1>
              <p className="text-muted-foreground">{t('managePaymentMethods')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border/50 p-4 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{t('paymentMethods')}</h3>
              <button
                onClick={() => setIsAddingMethod(true)}
                className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                {t('addPaymentMethod')}
              </button>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payment methods found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={method.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    style={{ 
                      animationDelay: `${index * 0.05 + 0.2}s`, 
                      animationFillMode: 'backwards' 
                    }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: method.color }}
                      />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {typeOptions.find(opt => opt.value === method.type)?.label}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(method.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isAddingMethod && (
            <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4 slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <h3 className="text-lg font-medium mb-4">{t('addPaymentMethod')}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="methodName" className="block text-sm font-medium text-foreground mb-1">
                    {t('methodName')}
                  </label>
                  <input
                    id="methodName"
                    type="text"
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. My Credit Card"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="methodType" className="block text-sm font-medium text-foreground mb-1">
                    {t('methodType')}
                  </label>
                  <select
                    id="methodType"
                    value={newMethodType}
                    onChange={(e) => setNewMethodType(e.target.value as 'credit' | 'debit' | 'cash' | 'other')}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="methodColor" className="block text-sm font-medium text-foreground mb-1">
                    {t('methodColor')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="methodColor"
                      type="color"
                      value={newMethodColor}
                      onChange={(e) => setNewMethodColor(e.target.value)}
                      className="w-10 h-10 rounded-md border border-input cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground">{newMethodColor}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingMethod(false)}
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTransaction')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDeleteMethod')}
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
    </div>
  );
};

export default PaymentMethods;
