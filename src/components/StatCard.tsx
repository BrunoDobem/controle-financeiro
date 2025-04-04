import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
  alert?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className,
  delay = 0,
  alert = false 
}) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300",
        "border border-border/50 h-full",
        "slide-up opacity-0",
        alert && "border-red-500 bg-red-50 dark:bg-red-950/20",
        className
      )}
      style={{ animationDelay: `${delay * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
        <p className={cn(
          "text-xs sm:text-sm font-medium truncate mr-2", 
          alert ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
        )}>
          {title}
        </p>
        <div className={cn(
          "p-1.5 sm:p-2 rounded-lg shrink-0", 
          alert ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-primary/10 text-primary"
        )}>
          {React.cloneElement(icon as React.ReactElement, {
            className: 'w-4 h-4 sm:w-5 sm:h-5'
          })}
        </div>
      </div>
      <div className="mt-0.5 sm:mt-1">
        <h3 className={cn(
          "text-lg sm:text-2xl font-bold truncate", 
          alert && "text-red-600 dark:text-red-400"
        )}>
          {value}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            {description}
          </p>
        )}
      </div>
      {trend && (
        <div className="mt-2 sm:mt-3 flex items-center">
          <div 
            className={cn(
              "flex items-center text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full",
              trend.isPositive 
                ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" 
                : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {trend.isPositive ? (
              <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            ) : (
              <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            )}
            {Math.abs(trend.value)}%
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground ml-1.5 sm:ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
