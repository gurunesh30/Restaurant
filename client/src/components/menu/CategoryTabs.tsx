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
        <div className="mb-5 overflow-auto">
            <div className="d-flex flex-nowrap pb-2 mx-auto" style={{ gap: '15px' }}>
                <button
                    className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap flex-shrink-0 border-0 ${!selectedCategoryId ? 'shadow-sm active-tab text-white' : 'bg-white text-muted shadow-sm'
                        }`}
                    style={{
                        backgroundColor: !selectedCategoryId ? '#E64A19' : 'transparent',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Montserrat', sans-serif"
                    }}
                    onClick={() => onSelectCategory(undefined)}
                >
                    All Menu
                </button>

                {categories.map((category) => (
                    <button
                        key={category._id}
                        className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap flex-shrink-0 border-0 ${selectedCategoryId === category._id ? 'shadow-sm active-tab text-white' : 'bg-white text-muted shadow-sm'
                            }`}
                        style={{
                            backgroundColor: selectedCategoryId === category._id ? '#E64A19' : 'transparent',
                            transition: 'all 0.3s ease',
                            fontFamily: "'Montserrat', sans-serif"
                        }}
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
