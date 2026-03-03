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
        <div className="mb-5 border-bottom pb-3">
            <ul className="nav nav-pills d-flex flex-nowrap overflow-auto" style={{ whiteSpace: 'nowrap', paddingBottom: '10px' }}>
                <li className="nav-item">
                    <button
                        className={`nav-link custom-tab border-0 bg-transparent ${!selectedCategoryId ? 'active shadow-sm' : ''}`}
                        onClick={() => onSelectCategory(undefined)}
                    >
                        🌟 All Items
                    </button>
                </li>

                {categories.map((category) => (
                    <li className="nav-item" key={category._id}>
                        <button
                            className={`nav-link custom-tab border-0 bg-transparent ${selectedCategoryId === category._id ? 'active shadow-sm' : ''}`}
                            onClick={() => onSelectCategory(category._id)}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryTabs;
