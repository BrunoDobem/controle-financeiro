import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface ExpenseSummaryProps {
  data: {
    category: string;
    amount: number;
  }[];
  className?: string;
}

const COLORS = {
  food: '#f97316',
  shopping: '#3b82f6',
  transport: '#22c55e',
  entertainment: '#a855f7',
  housing: '#ef4444',
  utilities: '#eab308',
  health: '#ec4899', 
  other: '#6b7280'
};

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ data, className }) => {
  const { t } = useTranslation();
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  
  const chartData = data.map(item => ({
    name: t(item.category),
    value: item.amount,
    category: item.category,
    percentage: Math.round((item.amount / totalAmount) * 100)
  }));
  
  return (
    <div className={cn("bg-card rounded-xl shadow-sm border border-border/50 p-3 sm:p-4", className)}>
      <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{t('categoryBreakdown')}</h3>
      
      {totalAmount === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base text-muted-foreground">{t('noTransactionsFound')}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('addTransaction')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex justify-center items-center h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.category as keyof typeof COLORS] || '#6b7280'} 
                    />
                  ))}
                </Pie>
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <ul className="space-y-2 sm:space-y-3">
              {chartData.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[item.category as keyof typeof COLORS] || '#6b7280' }}
                    />
                    <span className="text-xs sm:text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm font-medium mr-2">${item.value.toFixed(2)}</span>
                    <div className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-1.5 sm:px-2 py-0.5 rounded-full">
                      {item.percentage}%
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">{t('totalSpending')}</span>
                <span className="text-base sm:text-lg font-bold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;
