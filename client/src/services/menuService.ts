import api from './api';
import type { PaginatedResponse, ApiResponse } from '../types/api.types';
import type { MenuItem, MenuFilters } from '../types/menu.types';

export const getMenuItems = async (filters?: MenuFilters): Promise<PaginatedResponse<MenuItem>> => {
    const response = await api.get('/menu', { params: filters });
    return response.data;
};

export const getTrendingItems = async (): Promise<ApiResponse<MenuItem[]>> => {
    const response = await api.get('/menu/trending');
    return response.data;
};
