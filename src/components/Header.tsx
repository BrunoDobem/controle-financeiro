
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, CreditCard, PieChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border/40 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div>
            <NavLink to="/" className="text-xl font-bold text-foreground">
              ExpenseTracker
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )
                }
                end
              >
                {item.icon}
                {item.path === '/payment-methods' ? t('paymentMethods') : t(item.label.toLowerCase())}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-40 transition-transform transform md:hidden pt-16",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container mx-auto px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-3 rounded-lg text-sm font-medium flex items-center transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
