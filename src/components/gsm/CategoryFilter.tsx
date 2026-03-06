// ============================================
// CATEGORY FILTER COMPONENT
// Horizontal chips/tabs for filtering tools by category
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Array<{
    id: string;
    name: string;
    icon?: React.ReactNode;
  }>;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mask-linear-fade">
      {/* All category chip */}
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          "flex-shrink-0 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300",
          selectedCategory === 'all'
            ? "bg-gradient-to-r from-primary to-brand-green text-white shadow-lg shadow-primary/25"
            : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl"
        )}
      >
        Todas
      </button>

      {/* Category chips */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex-shrink-0 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2",
            selectedCategory === category.id
              ? "bg-gradient-to-r from-primary to-brand-green text-white shadow-lg shadow-primary/25"
              : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl"
          )}
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
