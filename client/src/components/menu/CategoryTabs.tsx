import React from 'react';
import type { Category } from '../../types/category.types';

interface CategoryTabsProps {
    categories: Category[];
    selectedCategoryId?: string;
    onSelectCategory: (categoryId?: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
    categories,
    selectedCategoryId,
    onSelectCategory
}) => {
    return (
        <div className="mb-4 overflow-auto pb-2">
            <div className="nav nav-pills flex-nowrap gap-2">
                <button
                    className={`nav-link text-nowrap rounded-pill border-0 ${!selectedCategoryId ? 'active' : 'bg-white text-dark shadow-sm'}`}
                    onClick={() => onSelectCategory(undefined)}
                >
                    All Menu
                </button>
                {categories.map((category) => (
                    <button
                        key={category._id}
                        className={`nav-link text-nowrap rounded-pill border-0 ${selectedCategoryId === category._id ? 'active' : 'bg-white text-dark shadow-sm'}`}
                        onClick={() => onSelectCategory(category._id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabs;
