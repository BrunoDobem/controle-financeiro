
import React from 'react';
import { cn } from '@/lib/utils';

export type Category = 
  | 'food' 
  | 'shopping' 
  | 'transport'
  | 'entertainment'
  | 'housing'
  | 'utilities'
  | 'health'
  | 'other';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryIcons: Record<Category, string> = {
  food: '🍔',
  shopping: '🛍️',
  transport: '🚗',
  entertainment: '🎬',
  housing: '🏠',
  utilities: '💡',
  health: '🏥',
  other: '📦',
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  return (
    <div 
      className={cn(
        `category-${category} inline-flex items-center px-2 py-1 rounded-md text-xs font-medium`,
        className
      )}
    >
      <span className="mr-1 text-xs">{categoryIcons[category]}</span>
      <span className="capitalize">{category}</span>
    </div>
  );
};

export default CategoryBadge;
