import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Wallet, ArrowDown, Clock, CreditCard, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatCard from './StatCard';
import ExpenseSummary from './ExpenseSummary';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import { useTransactions } from '@/context/TransactionsContext';
import { useSettings } from '@/context/SettingsContext';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { transactions, paymentMethods } = useTransactions();
  const { settings } = useSettings();
  
  // Currency formatter function
  const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat(settings.language === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: settings.language === 'pt-BR' ? 'BRL' : 'USD'
    });
    return formatter.format(value);
  };
  
  // Generate chart data from transactions
  const generateChartData = () => {
    const days = 7;
    const today = new Date();
    const dailyData: { [key: string]: number } = {};
    
    // Initialize the past 7 days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (days - 1) + i);
      const dayName = date.toLocaleDateString(settings.language === 'pt-BR' ? 'pt-BR' : 'en-US', { weekday: 'short' });
      dailyData[dayName] = 0;
    }
    
    // Sum transactions by day
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      // Only include transactions from the past 7 days
      if ((today.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24) < days) {
        const dayName = transactionDate.toLocaleDateString(settings.language === 'pt-BR' ? 'pt-BR' : 'en-US', { weekday: 'short' });
        dailyData[dayName] = (dailyData[dayName] || 0) + transaction.amount;
      }
    });
    
    // Convert to array format for chart
    return Object.keys(dailyData).map(key => ({
      name: key,
      spending: dailyData[key]
    }));
  };
  
  const chartData = generateChartData();
  
  // Calculate current month transactions
  const getCurrentMonthTransactions = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    return transactions.filter(transaction => {
      // For regular transactions, check the transaction date
      const transactionDate = new Date(transaction.date);
      
      // For credit card transactions with future due date, check the dueMonth
      if (transaction.dueMonth) {
        const [dueYear, dueMonth] = transaction.dueMonth.split('-').map(Number);
        return dueYear === currentYear && dueMonth - 1 === currentMonth;
      }
      
      return transactionDate.getFullYear() === currentYear && 
             transactionDate.getMonth() === currentMonth;
    });
  };
  
  const currentMonthTransactions = getCurrentMonthTransactions();
  const totalSpending = currentMonthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Check if spending limit is exceeded
  const isSpendingLimitExceeded = totalSpending > settings.spendingLimit;
  
  // Show alert toast when spending limit is exceeded
  useEffect(() => {
    if (isSpendingLimitExceeded) {
      toast.warning(
        `${t('spendingLimitAlert')}: ${t('limitExceeded')} ${formatCurrency(settings.spendingLimit)}`,
        {
          duration: 5000,
          icon: <AlertTriangle className="text-yellow-500" />
        }
      );
    }
  }, [isSpendingLimitExceeded, settings.spendingLimit, t]);
  
  // Spending by category
  const spendingByCategory = currentMonthTransactions.reduce((acc, transaction) => {
    const existingCategory = acc.find(item => item.category === transaction.category);
    
    if (existingCategory) {
      existingCategory.amount += transaction.amount;
    } else {
      acc.push({
        category: transaction.category,
        amount: transaction.amount
      });
    }
    
    return acc;
  }, [] as { category: string; amount: number }[]);
  
  // Get largest expense
  const largestExpense = transactions.length > 0 ? 
    transactions.reduce((max, t) => t.amount > max.amount ? t : max, transactions[0]) : null;

  // Calculate spending limit progress
  const spendingLimitProgress = (totalSpending / settings.spendingLimit) * 100;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 mt-14 sm:mt-16">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">{t('financialDashboard')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t('trackSpending')}</p>
      </div>
      
      {/* Spending Limit Progress */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-card rounded-xl shadow-sm border border-border/50 p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs sm:text-sm font-medium">{t('monthlySpendingLimit')}</h3>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {formatCurrency(totalSpending)} / {formatCurrency(settings.spendingLimit)}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                spendingLimitProgress >= 100 ? "bg-red-500" :
                spendingLimitProgress >= 80 ? "bg-yellow-500" :
                "bg-primary"
              )}
              style={{ width: `${Math.min(spendingLimitProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title={t('totalSpending')}
          value={formatCurrency(totalSpending)}
          description={t('currentMonth')}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12, isPositive: false }}
          delay={0}
          alert={isSpendingLimitExceeded}
        />
        
        <StatCard
          title={t('averageDaily')}
          value={formatCurrency(totalSpending / 30)}
          description={t('last30Days')}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 3, isPositive: true }}
          delay={1}
        />
        
        <StatCard
          title={t('largestExpense')}
          value={largestExpense ? formatCurrency(largestExpense.amount) : '-'}
          description={largestExpense ? largestExpense.description : t('noTransactionsFound')}
          icon={<ArrowDown className="h-5 w-5" />}
          delay={2}
        />
        
        <StatCard
          title={t('recentActivity')}
          value={`${transactions.length} ${t('transactions')}`}
          description={t('last30Days')}
          icon={<Clock className="h-5 w-5" />}
          delay={3}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <div className={cn(
          "lg:col-span-2 bg-card rounded-xl shadow-sm border border-border/50 p-3 sm:p-4",
          "slide-up"
        )} style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-medium">{t('spendingTrends')}</h3>
            <div className="flex space-x-2">
              <div className="text-[10px] sm:text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {t('thisWeek')}
              </div>
            </div>
          </div>
          
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), t('spending')]}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="spending"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <TransactionForm />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <TransactionList />
        </div>
        
        <div className="slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <ExpenseSummary data={spendingByCategory} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
