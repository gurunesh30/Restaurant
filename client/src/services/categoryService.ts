import api from './api';
import type { ApiResponse } from '../types/api.types';
import type { Category } from '../types/category.types';

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/categories');
    return response.data;
};
