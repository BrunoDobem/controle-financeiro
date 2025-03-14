
import React, { useState } from 'react';
import Header from '@/components/Header';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data
const monthlyData = [
  { name: 'Jan', expenses: 1200 },
  { name: 'Feb', expenses: 1900 },
  { name: 'Mar', expenses: 1500 },
  { name: 'Apr', expenses: 1700 },
  { name: 'May', expenses: 1300 },
  { name: 'Jun', expenses: 1600 },
];

const categoryData = [
  { name: 'Food', value: 35 },
  { name: 'Housing', value: 25 },
  { name: 'Transport', value: 15 },
  { name: 'Entertainment', value: 10 },
  { name: 'Shopping', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1'];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [dateRange, setDateRange] = useState('6months');
  
  const tabs = [
    { id: 'monthly', label: 'Monthly Overview', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { id: 'trends', label: 'Spending Trends', icon: <LineChartIcon className="w-4 h-4 mr-2" /> },
    { id: 'breakdown', label: 'Category Breakdown', icon: <PieChartIcon className="w-4 h-4 mr-2" /> },
  ];
  
  const dateRanges = [
    { id: '1month', label: '1 Month' },
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: '1year', label: '1 Year' },
  ];
  
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
              <h1 className="text-2xl font-bold mb-1">Financial Reports</h1>
              <p className="text-muted-foreground">Analyze your spending patterns</p>
            </div>
          </div>
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
                    <YAxis tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Expenses']}
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
                    <YAxis tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Expenses']}
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
                          formatter={(value) => [`${value}%`, 'Percentage']}
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
                        <span className="text-sm font-medium">Total Spending</span>
                        <span className="text-lg font-bold">$7,200</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4">
            <h3 className="text-lg font-medium mb-4">Spending Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Monthly</span>
                <span className="font-medium">$1,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Highest Month</span>
                <span className="font-medium">$1,900 (Feb)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lowest Month</span>
                <span className="font-medium">$1,200 (Jan)</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Year-to-Date</span>
                <span className="text-lg font-bold">$9,200</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4">
            <h3 className="text-lg font-medium mb-4">Top Spending Categories</h3>
            <div className="space-y-3">
              {categoryData.slice(0, 4).map((category, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{category.name}</span>
                    <span className="text-sm font-medium">{category.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 ease-out group-hover:opacity-80"
                      style={{ 
                        width: `${category.value}%`, 
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
