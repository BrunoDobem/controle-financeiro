import { useSettings } from '@/context/SettingsContext';
import { ReactNode, createContext, useContext } from 'react';

interface TranslationContextType {
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();
  
  const t = (key: string) => {
    if (settings.language === 'pt-BR') {
      return translations.pt[key] || key;
    }
    return translations.en[key] || key;
  };
  
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

const translations = {
  en: {
    // Dashboard
    'financialDashboard': 'Financial Dashboard',
    'trackSpending': 'Track your spending and manage your finances',
    'totalSpending': 'Total Spending',
    'currentMonth': 'Current month',
    'averageDaily': 'Average Daily',
    'last30Days': 'Last 30 days',
    'largestExpense': 'Largest Expense',
    'thisMonth': 'This month',
    'recentActivity': 'Recent Activity',
    'transactions': 'transactions',
    'spendingTrends': 'Spending Trends',
    'thisWeek': 'This Week',
    'spending': 'Spending',
    
    // Transaction form
    'addNewTransaction': 'Add New Transaction',
    'newTransaction': 'New Transaction',
    'description': 'Description',
    'whatDidYouSpendOn': 'What did you spend on?',
    'amount': 'Amount',
    'date': 'Date',
    'category': 'Category',
    'paymentMethod': 'Payment Method',
    'dueMonth': 'Due Month (Credit Card)',
    'currentMonthLabel': 'Current Month',
    'nextMonth': 'Next Month',
    'cancel': 'Cancel',
    'addTransaction': 'Add Transaction',
    'fillAllFields': 'Please fill all required fields',
    'transactionAdded': 'Transaction added successfully',
    
    // Transaction list
    'recentTransactions': 'Recent Transactions',
    'searchTransactions': 'Search transactions...',
    'noTransactionsFound': 'No transactions found',
    'deleteTransaction': 'Delete',
    'confirmDelete': 'Are you sure you want to delete this transaction?',
    'yes': 'Yes',
    'no': 'No',
    'transactionDeleted': 'Transaction deleted successfully',
    
    // Categories
    'food': 'Food',
    'shopping': 'Shopping',
    'transport': 'Transport',
    'entertainment': 'Entertainment',
    'housing': 'Housing',
    'utilities': 'Utilities',
    'health': 'Health',
    'other': 'Other',
    
    // Reports
    'financialReports': 'Financial Reports',
    'analyzeSpending': 'Analyze your spending patterns',
    'monthlyOverview': 'Monthly Overview',
    'spendingTrendsReport': 'Spending Trends',
    'categoryBreakdown': 'Category Breakdown',
    'expenses': 'Expenses',
    'percentage': 'Percentage',
    'spendingSummary': 'Spending Summary',
    'averageMonthly': 'Average Monthly',
    'highestMonth': 'Highest Month',
    'lowestMonth': 'Lowest Month',
    'yearToDate': 'Year-to-Date',
    'topSpendingCategories': 'Top Spending Categories',
    'paymentMethodAnalysis': 'Payment Method Analysis',
    
    // Settings
    'settings': 'Settings',
    'personalizeApp': 'Personalize your application',
    'appearance': 'Appearance',
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
    'system': 'System (Device)',
    'language': 'Language',
    'english': 'English',
    'portuguese': 'Portuguese (Brazil)',
    'financialSettings': 'Financial Settings',
    'monthlySpendingLimit': 'Monthly Spending Limit',
    'limitDescription': 'You will be alerted when you exceed this amount',
    'save': 'Save',
    'saveSuccess': 'Settings saved successfully',
    
    // Payment methods
    'paymentMethods': 'Payment Methods',
    'managePaymentMethods': 'Manage your payment methods',
    'addPaymentMethod': 'Add Payment Method',
    'methodName': 'Method Name',
    'methodType': 'Type',
    'methodColor': 'Color',
    'methodAdded': 'Payment method added successfully',
    'methodDeleted': 'Payment method deleted successfully',
    'cannotDeleteInUse': 'Cannot delete payment method that is in use',
    'credit': 'Credit Card',
    'debit': 'Debit Card',
    'cash': 'Cash',
    'confirmDeleteMethod': 'Are you sure you want to delete this payment method?',
    
    // Alerts
    'spendingLimitAlert': 'Spending Limit Alert',
    'limitExceeded': 'You have exceeded your monthly spending limit of'
  },
  pt: {
    // Dashboard
    'financialDashboard': 'Painel Financeiro',
    'trackSpending': 'Acompanhe seus gastos e gerencie suas finanças',
    'totalSpending': 'Gasto Total',
    'currentMonth': 'Mês atual',
    'averageDaily': 'Média Diária',
    'last30Days': 'Últimos 30 dias',
    'largestExpense': 'Maior Despesa',
    'thisMonth': 'Este mês',
    'recentActivity': 'Atividade Recente',
    'transactions': 'transações',
    'spendingTrends': 'Tendências de Gastos',
    'thisWeek': 'Esta Semana',
    'spending': 'Gastos',
    
    // Transaction form
    'addNewTransaction': 'Adicionar Nova Transação',
    'newTransaction': 'Nova Transação',
    'description': 'Descrição',
    'whatDidYouSpendOn': 'Com o que você gastou?',
    'amount': 'Valor',
    'date': 'Data',
    'category': 'Categoria',
    'paymentMethod': 'Forma de Pagamento',
    'dueMonth': 'Mês de Vencimento (Cartão de Crédito)',
    'currentMonthLabel': 'Mês Atual',
    'nextMonth': 'Próximo Mês',
    'cancel': 'Cancelar',
    'addTransaction': 'Adicionar Transação',
    'fillAllFields': 'Por favor, preencha todos os campos obrigatórios',
    'transactionAdded': 'Transação adicionada com sucesso',
    
    // Transaction list
    'recentTransactions': 'Transações Recentes',
    'searchTransactions': 'Pesquisar transações...',
    'noTransactionsFound': 'Nenhuma transação encontrada',
    'deleteTransaction': 'Excluir',
    'confirmDelete': 'Tem certeza que deseja excluir esta transação?',
    'yes': 'Sim',
    'no': 'Não',
    'transactionDeleted': 'Transação excluída com sucesso',
    
    // Categories
    'food': 'Alimentação',
    'shopping': 'Compras',
    'transport': 'Transporte',
    'entertainment': 'Entretenimento',
    'housing': 'Moradia',
    'utilities': 'Serviços',
    'health': 'Saúde',
    'other': 'Outros',
    
    // Reports
    'financialReports': 'Relatórios Financeiros',
    'analyzeSpending': 'Analise seus padrões de gastos',
    'monthlyOverview': 'Visão Mensal',
    'spendingTrendsReport': 'Tendências de Gastos',
    'categoryBreakdown': 'Análise por Categoria',
    'expenses': 'Despesas',
    'percentage': 'Porcentagem',
    'spendingSummary': 'Resumo de Gastos',
    'averageMonthly': 'Média Mensal',
    'highestMonth': 'Mês Mais Alto',
    'lowestMonth': 'Mês Mais Baixo',
    'yearToDate': 'Acumulado do Ano',
    'topSpendingCategories': 'Principais Categorias de Gastos',
    'paymentMethodAnalysis': 'Análise por Forma de Pagamento',
    
    // Settings
    'settings': 'Configurações',
    'personalizeApp': 'Personalize sua aplicação',
    'appearance': 'Aparência',
    'theme': 'Tema',
    'light': 'Claro',
    'dark': 'Escuro',
    'system': 'Sistema (Dispositivo)',
    'language': 'Idioma',
    'english': 'Inglês',
    'portuguese': 'Português (Brasil)',
    'financialSettings': 'Configurações Financeiras',
    'monthlySpendingLimit': 'Limite Mensal de Gastos',
    'limitDescription': 'Você será alertado quando exceder este valor',
    'save': 'Salvar',
    'saveSuccess': 'Configurações salvas com sucesso',
    
    // Payment methods
    'paymentMethods': 'Formas de Pagamento',
    'managePaymentMethods': 'Gerencie suas formas de pagamento',
    'addPaymentMethod': 'Adicionar Forma de Pagamento',
    'methodName': 'Nome do Método',
    'methodType': 'Tipo',
    'methodColor': 'Cor',
    'methodAdded': 'Forma de pagamento adicionada com sucesso',
    'methodDeleted': 'Forma de pagamento excluída com sucesso',
    'cannotDeleteInUse': 'Não é possível excluir uma forma de pagamento em uso',
    'credit': 'Cartão de Crédito',
    'debit': 'Cartão de Débito',
    'cash': 'Dinheiro',
    'confirmDeleteMethod': 'Tem certeza que deseja excluir esta forma de pagamento?',
    
    // Alerts
    'spendingLimitAlert': 'Alerta de Limite de Gastos',
    'limitExceeded': 'Você excedeu seu limite mensal de gastos de'
  }
};
