import { useState, useEffect } from 'react';
import type { MenuItem, MenuFilters } from '../types/menu.types';
import { getMenuItems } from '../services/menuService';

export const useMenu = (initialFilters?: MenuFilters) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<MenuFilters>(initialFilters || {});

    // Pagination metadata
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await getMenuItems(filters);

                if (isMounted) {
                    if (response.success) {
                        setItems(response.data);
                        setTotal(response.total);
                        setPage(response.page);
                        setPages(response.pages);
                        setError(null);
                    } else {
                        setError(response.message || 'Failed to fetch menu items');
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'An error occurred fetching menu');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchMenu();

        return () => {
            isMounted = false;
        };
    }, [filters.categoryId, filters.search, filters.page, filters.limit, filters.sort, filters.isVeg, filters.available]);

    const updateFilters = (newFilters: Partial<MenuFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
    };

    return {
        items,
        loading,
        error,
        filters,
        updateFilters,
        total,
        page,
        pages
    };
};
