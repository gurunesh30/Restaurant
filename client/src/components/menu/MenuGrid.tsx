import React from 'react';
import type { MenuItem } from '../../types/menu.types';
import MenuItemCard from '../common/MenuItemCard';
import Loader from '../common/Loader';

interface MenuGridProps {
    items: MenuItem[];
    loading: boolean;
    error: string | null;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, loading, error }) => {
    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center rounded-4 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-5">
                <h4 className="text-muted fw-bold serif-font mb-3">
                    Our selection is momentarily unavailable.
                </h4>
                <p className="text-muted small opacity-50">Please refine your search or explore other categories.</p>
            </div>
        );
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {items.map((item) => (
                <div className="col" key={item._id}>
                    <MenuItemCard item={item} />
                </div>
            ))}
        </div>
    );
};

export default MenuGrid;
