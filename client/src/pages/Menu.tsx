import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useMenu } from '../hooks/useMenu';
import CategoryTabs from '../components/menu/CategoryTabs';
import MenuGrid from '../components/menu/MenuGrid';

const Menu: React.FC = () => {
    const { categories, loading: categoriesLoading } = useCategories();
    const { items, loading: menuLoading, error: menuError, filters, updateFilters } = useMenu({ available: true, limit: 12 });
    const [searchTerm, setSearchTerm] = useState('');

    const handleCategoryChange = (categoryId?: string) => {
        updateFilters({ categoryId, page: 1 });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchTerm, page: 1 });
    };

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-4">Our Menu</h1>

            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSearch}>
                        <div className="input-group shadow-sm rounded-pill overflow-hidden border bg-white">
                            <input
                                type="text"
                                className="form-control border-0 shadow-none px-4"
                                placeholder="Search dishes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary px-4 fw-bold">Search</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Categories */}
            {!categoriesLoading && categories.length > 0 && (
                <CategoryTabs
                    categories={categories}
                    selectedCategoryId={filters.categoryId}
                    onSelectCategory={handleCategoryChange}
                />
            )}

            {/* Menu Grid */}
            <MenuGrid items={items} loading={menuLoading} error={menuError} />
        </div>
    );
};

export default Menu;
