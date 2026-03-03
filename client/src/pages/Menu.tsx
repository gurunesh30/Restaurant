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
            {/* Page Header */}
            <div className="text-center mb-5 mt-4">
                <h1 className="fw-bold display-4 mb-3">
                    Explore Our <span className="text-primary-custom">Menu</span>
                </h1>
                <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>
                    Discover the authentic taste of Indian cuisine. Prepared fresh daily with the finest spices and traditional recipes passed down through generations.
                </p>
            </div>

            {/* Search Bar */}
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 col-lg-6">
                    <form onSubmit={handleSearch}>
                        <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white p-1 border">
                            <span className="input-group-text bg-transparent border-0 ps-4 text-muted">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 shadow-none bg-transparent py-3"
                                placeholder="Search for your favorite dish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary-custom rounded-pill px-4 m-1 fw-bold"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Category Tabs Section */}
            {!categoriesLoading && categories.length > 0 && (
                <CategoryTabs
                    categories={categories}
                    selectedCategoryId={filters.categoryId}
                    onSelectCategory={handleCategoryChange}
                />
            )}

            {/* Grid List */}
            <div className="mt-4">
                <MenuGrid items={items} loading={menuLoading} error={menuError} />
            </div>
        </div>
    );
};

export default Menu;
