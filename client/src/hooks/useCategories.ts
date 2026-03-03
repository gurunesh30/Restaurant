import { useState, useEffect } from 'react';
import type { Category } from '../types/category.types';
import { getCategories } from '../services/categoryService';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                } else {
                    setError(response.message || 'Failed to fetch categories');
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred fetching categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};
