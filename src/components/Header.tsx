import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, CreditCard, PieChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Previne scroll quando menu mobile está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { path: '/transactions', label: 'Transactions', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { path: '/reports', label: 'Reports', icon: <PieChart className="w-5 h-5 mr-2" /> },
    { path: '/payment-methods', label: 'Payment Methods', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div>
            <NavLink to="/" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white" onClick={closeMenu}>
              Flow Financeiro
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                  )
                }
                end
              >
                {item.icon}
                <span>
                  {item.path === '/payment-methods' ? t('paymentMethods') : t(item.label.toLowerCase())}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors relative z-50",
              isMenuOpen 
                ? "text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-800" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
            )}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Menu</span>
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-white dark:bg-gray-900 z-40 transition-all duration-300 md:hidden",
          isMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="container mx-auto px-4 py-4 mt-14 sm:mt-16">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-3 rounded-lg text-base font-medium flex items-center transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                    )
                  }
                  onClick={closeMenu}
                  end
                >
                  {item.icon}
                  {item.path === '/payment-methods' ? t('paymentMethods') : t(item.label.toLowerCase())}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
