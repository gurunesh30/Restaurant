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
        <div className="min-vh-100" style={{ backgroundColor: '#F1EDE4', position: 'relative', overflow: 'hidden' }}>

            {/* Decorative Blob pattern - minimal implementation */}
            <div
                className="position-absolute rounded-circle"
                style={{
                    width: '400px',
                    height: '400px',
                    backgroundColor: 'rgba(230, 74, 25, 0.05)',
                    top: '-10%',
                    right: '-5%',
                    filter: 'blur(50px)',
                    zIndex: 0
                }}
            ></div>

            <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
                {/* Page Header */}
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-4 text-dark mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Our <span style={{ color: '#E64A19' }}>Menu</span>
                    </h1>
                    <p className="text-muted lead mx-auto" style={{ maxWidth: '600px', fontFamily: "'Lexend', sans-serif" }}>
                        Discover the real taste of Indian food. Authentic spices, traditional recipes, and pure love in every bite.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 col-lg-6">
                        <form onSubmit={handleSearch} className="position-relative">
                            <input
                                type="text"
                                className="form-control form-control-lg rounded-pill border-0 shadow-sm ps-4 pe-5"
                                placeholder="Search for your favorite dish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ backgroundColor: '#ffffff' }}
                            />
                            <button
                                type="submit"
                                className="btn position-absolute top-50 end-0 translate-middle-y rounded-circle me-1"
                                style={{ backgroundColor: '#FFC107', width: '40px', height: '40px', padding: 0 }}
                            >
                                <i className="bi bi-search text-dark"></i>
                                <span className="visually-hidden">Search</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Content Section */}
                {!categoriesLoading && categories.length > 0 && (
                    <CategoryTabs
                        categories={categories}
                        selectedCategoryId={filters.categoryId}
                        onSelectCategory={handleCategoryChange}
                    />
                )}

                <MenuGrid items={items} loading={menuLoading} error={menuError} />

            </div>
        </div>
    );
};

export default Menu;
