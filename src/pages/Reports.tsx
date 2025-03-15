import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon, Calendar, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/context/TransactionsContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1'];

const Reports = () => {
  const { t } = useTranslation();
  const { transactions, paymentMethods } = useTransactions();
  const formatCurrency = useCurrencyFormat();
  const [activeTab, setActiveTab] = useState('monthly');
  const [dateRange, setDateRange] = useState('6months');
  
  const tabs = [
    { id: 'monthly', label: t('monthlyOverview'), icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { id: 'trends', label: t('spendingTrendsReport'), icon: <LineChartIcon className="w-4 h-4 mr-2" /> },
    { id: 'breakdown', label: t('categoryBreakdown'), icon: <PieChartIcon className="w-4 h-4 mr-2" /> },
    { id: 'payment', label: t('paymentMethodBreakdown'), icon: <CreditCard className="w-4 h-4 mr-2" /> },
  ];
  
  const dateRanges = [
    { 
      id: '1month', 
      label: t('last30Days'),
      getStartDate: (now: Date) => new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    },
    { 
      id: '3months', 
      label: `3 ${t('months')}`,
      getStartDate: (now: Date) => new Date(now.getFullYear(), now.getMonth() - 3, 1)
    },
    { 
      id: '6months', 
      label: `6 ${t('months')}`,
      getStartDate: (now: Date) => new Date(now.getFullYear(), now.getMonth() - 6, 1)
    },
    { 
      id: '1year', 
      label: `1 ${t('year')}`,
      getStartDate: (now: Date) => new Date(now.getFullYear() - 1, now.getMonth(), 1)
    },
  ];

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const selectedRange = dateRanges.find(range => range.id === dateRange);
    if (!selectedRange) return transactions;

    const startDate = selectedRange.getStartDate(now);
    
    // Encontra a data mais distante entre todas as parcelas
    let furthestDate = now;
    transactions.forEach(transaction => {
      if (transaction.installments?.length) {
        const lastInstallment = transaction.installments[transaction.installments.length - 1];
        const lastDueDate = new Date(lastInstallment.dueDate);
        if (lastDueDate > furthestDate) {
          furthestDate = lastDueDate;
        }
      }
    });

    return transactions.filter(transaction => {
      if (!transaction.installments) {
        // Para transações regulares, usa a data da transação
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= furthestDate;
      }
      
      // Para transações parceladas, inclui se qualquer parcela estiver no período
      return transaction.installments.some(installment => {
        const dueDate = new Date(installment.dueDate);
        return dueDate >= startDate && dueDate <= furthestDate;
      });
    });
  }, [transactions, dateRange, dateRanges]);

  const monthlyData = useMemo(() => {
    const monthlyTotals = new Map();
    const now = new Date();
    const selectedRange = dateRanges.find(range => range.id === dateRange);
    const startDate = selectedRange ? selectedRange.getStartDate(now) : new Date(now.getFullYear(), now.getMonth() - 11, 1);
    
    // Encontra a data mais distante entre todas as parcelas
    let furthestDate = now;
    transactions.forEach(transaction => {
      if (transaction.installments?.length) {
        const lastInstallment = transaction.installments[transaction.installments.length - 1];
        const lastDueDate = new Date(lastInstallment.dueDate);
        if (lastDueDate > furthestDate) {
          furthestDate = lastDueDate;
        }
      }
    });
    
    // Inicializa todos os meses até a data mais distante
    let currentDate = new Date(startDate);
    while (currentDate <= furthestDate) {
      const monthKey = currentDate.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyTotals.set(monthKey, 0);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Processa cada transação
    transactions.forEach(transaction => {
      if (!transaction.amount) return;

      const transactionDate = new Date(transaction.date);
      const selectedMethod = paymentMethods.find(m => m.id === transaction.paymentMethod);
      const isCreditCard = selectedMethod?.type === 'credit';
      
      // Se for uma transação parcelada de cartão de crédito
      if (isCreditCard && transaction.installments?.length > 0) {
        transaction.installments.forEach(installment => {
          const dueDate = new Date(installment.dueDate);
          if (dueDate >= startDate && dueDate <= furthestDate) {
            const monthKey = dueDate.toLocaleString('default', { month: 'short', year: '2-digit' });
            if (monthlyTotals.has(monthKey)) {
              monthlyTotals.set(
                monthKey,
                monthlyTotals.get(monthKey) + Math.abs(installment.amount)
              );
            }
          }
        });
      } 
      // Se for uma transação normal
      else if (transactionDate >= startDate && transactionDate <= furthestDate) {
        const monthKey = transactionDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyTotals.has(monthKey)) {
          monthlyTotals.set(
            monthKey,
            monthlyTotals.get(monthKey) + Math.abs(transaction.amount)
          );
        }
      }
    });

    return Array.from(monthlyTotals.entries())
      .map(([name, expenses]) => ({ name, expenses }))
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        const dateA = new Date(`${monthA} 20${yearA}`);
        const dateB = new Date(`${monthB} 20${yearB}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [transactions, dateRange, dateRanges, paymentMethods]);

  const categoryData = useMemo(() => {
    const categoryTotals = new Map();
    let totalAmount = 0;
    const now = new Date();
    const selectedRange = dateRanges.find(range => range.id === dateRange);
    const startDate = selectedRange ? selectedRange.getStartDate(now) : new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Encontra a data mais distante entre todas as parcelas
    let furthestDate = now;
    transactions.forEach(transaction => {
      if (transaction.installments?.length) {
        const lastInstallment = transaction.installments[transaction.installments.length - 1];
        const lastDueDate = new Date(lastInstallment.dueDate);
        if (lastDueDate > furthestDate) {
          furthestDate = lastDueDate;
        }
      }
    });

    transactions.forEach(transaction => {
      if (!transaction.amount) return;

      const category = transaction.category;
      const transactionDate = new Date(transaction.date);
      const selectedMethod = paymentMethods.find(m => m.id === transaction.paymentMethod);
      const isCreditCard = selectedMethod?.type === 'credit';

      // Processa transações parceladas de cartão de crédito
      if (isCreditCard && transaction.installments?.length > 0) {
        transaction.installments.forEach(installment => {
          const dueDate = new Date(installment.dueDate);
          if (dueDate >= startDate && dueDate <= furthestDate) {
            const amount = Math.abs(installment.amount);
            const current = categoryTotals.get(category) || 0;
            categoryTotals.set(category, current + amount);
            totalAmount += amount;
          }
        });
      }
      // Processa transações normais
      else if (transactionDate >= startDate && transactionDate <= furthestDate) {
        const amount = Math.abs(transaction.amount);
        const current = categoryTotals.get(category) || 0;
        categoryTotals.set(category, current + amount);
        totalAmount += amount;
      }
    });

    return Array.from(categoryTotals.entries())
      .map(([name, value]) => ({
        name: t(name),
        value: totalAmount > 0 ? Math.round((value / totalAmount) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, dateRange, dateRanges, t, paymentMethods]);

  const spendingSummary = useMemo(() => {
    if (monthlyData.length === 0) return {
      average: 0,
      highest: { amount: 0, month: '' },
      lowest: { amount: Infinity, month: '' },
      total: 0
    };

    const nonZeroMonths = monthlyData.filter(month => month.expenses > 0);
    const total = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
    const average = nonZeroMonths.length > 0 ? total / nonZeroMonths.length : 0;
    
    const highest = monthlyData.reduce((max, curr) => 
      curr.expenses > max.expenses ? curr : max,
      { expenses: 0, name: '' }
    );
    
    const lowest = nonZeroMonths.reduce((min, curr) => 
      curr.expenses < min.expenses ? curr : min,
      nonZeroMonths[0] || { expenses: 0, name: '' }
    );

    return {
      average,
      highest: { amount: highest.expenses, month: highest.name },
      lowest: { amount: lowest.expenses, month: lowest.name },
      total
    };
  }, [monthlyData]);

  const paymentMethodData = useMemo(() => {
    const methodTotals = new Map();
    let totalAmount = 0;
    const now = new Date();
    const selectedRange = dateRanges.find(range => range.id === dateRange);
    const startDate = selectedRange ? selectedRange.getStartDate(now) : new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Encontra a data mais distante entre todas as parcelas
    let furthestDate = now;
    transactions.forEach(transaction => {
      if (transaction.installments?.length) {
        const lastInstallment = transaction.installments[transaction.installments.length - 1];
        const lastDueDate = new Date(lastInstallment.dueDate);
        if (lastDueDate > furthestDate) {
          furthestDate = lastDueDate;
        }
      }
    });

    transactions.forEach(transaction => {
      if (!transaction.amount) return;

      const method = paymentMethods.find(m => m.id === transaction.paymentMethod);
      if (!method) return;

      const transactionDate = new Date(transaction.date);
      const isCreditCard = method.type === 'credit';

      // Processa transações parceladas de cartão de crédito
      if (isCreditCard && transaction.installments?.length > 0) {
        transaction.installments.forEach(installment => {
          const dueDate = new Date(installment.dueDate);
          if (dueDate >= startDate && dueDate <= furthestDate) {
            const amount = Math.abs(installment.amount);
            const current = methodTotals.get(method.name) || 0;
            methodTotals.set(method.name, current + amount);
            totalAmount += amount;
          }
        });
      }
      // Processa transações normais
      else if (transactionDate >= startDate && transactionDate <= furthestDate) {
        const amount = Math.abs(transaction.amount);
        const current = methodTotals.get(method.name) || 0;
        methodTotals.set(method.name, current + amount);
        totalAmount += amount;
      }
    });

    return Array.from(methodTotals.entries())
      .map(([name, value]) => ({
        name,
        value: totalAmount > 0 ? Math.round((value / totalAmount) * 100) : 0,
        amount: value
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, dateRange, dateRanges, paymentMethods]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 mt-16 page-transition fade-in">
        <div className="mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
              <PieChartIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{t('financialReports')}</h1>
              <p className="text-muted-foreground">{t('analyzeSpending')}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden mb-6 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="border-b border-border">
            <div className="flex flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium transition-colors relative",
                    activeTab === tab.id 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <div className="flex items-center text-sm bg-secondary rounded-lg overflow-hidden">
                <Calendar className="w-4 h-4 ml-3 text-muted-foreground" />
                {dateRanges.map(range => (
                  <button
                    key={range.id}
                    onClick={() => setDateRange(range.id)}
                    className={cn(
                      "px-3 py-1.5 transition-colors",
                      dateRange === range.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-96">
              {activeTab === 'monthly' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), t('expenses')]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Bar dataKey="expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {activeTab === 'trends' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), t('expenses')]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              
              {activeTab === 'breakdown' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  <div className="flex justify-center items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, t('percentage')]}
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid hsl(var(--border))',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <ul className="space-y-3">
                      {categoryData.map((entry, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">{entry.name}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {entry.value}%
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('totalSpending')}</span>
                        <span className="text-lg font-bold">{formatCurrency(spendingSummary.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} (${value}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `${formatCurrency(props.payload.amount)} (${value}%)`,
                            name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="space-y-4">
                      {paymentMethodData.map((method, index) => (
                        <div key={method.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{method.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(method.amount)}</div>
                            <div className="text-sm text-muted-foreground">{method.value}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4">
            <h3 className="text-lg font-medium mb-4">{t('spendingSummary')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('averageMonthly')}</span>
                <span className="font-medium">{formatCurrency(spendingSummary.average)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('highestMonth')}</span>
                <span className="font-medium">{formatCurrency(spendingSummary.highest.amount)} ({spendingSummary.highest.month})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('lowestMonth')}</span>
                <span className="font-medium">{formatCurrency(spendingSummary.lowest.amount)} ({spendingSummary.lowest.month})</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('yearToDate')}</span>
                <span className="text-lg font-bold">{formatCurrency(spendingSummary.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
