import type { MenuItem, MenuFilters } from '../types/menu.types';
import type { PaginatedResponse, ApiResponse } from '../types/api.types';
import api from './api';

// ──────────────────────────────────────────────────
// In-memory caches
// ──────────────────────────────────────────────────
const menuCache = new Map<string, { data: PaginatedResponse<MenuItem>; ts: number }>();
const trendingCache: { data: ApiResponse<MenuItem[]> | null; ts: number } = { data: null, ts: 0 };

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function makeKey(filters?: MenuFilters): string {
    if (!filters) return '__all__';
    return JSON.stringify(
        Object.entries(filters)
            .filter(([, v]) => v !== undefined && v !== null && v !== '')
            .sort(([a], [b]) => a.localeCompare(b))
    );
}

// ──────────────────────────────────────────────────
// Cached wrappers
// ──────────────────────────────────────────────────
export const getMenuItems = async (filters?: MenuFilters): Promise<PaginatedResponse<MenuItem>> => {
    const key = makeKey(filters);
    const cached = menuCache.get(key);

    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data;
    }

    const response = await api.get('/menu', { params: filters });
    const data: PaginatedResponse<MenuItem> = response.data;

    menuCache.set(key, { data, ts: Date.now() });
    return data;
};

export const getTrendingItems = async (): Promise<ApiResponse<MenuItem[]>> => {
    if (trendingCache.data && Date.now() - trendingCache.ts < CACHE_TTL_MS) {
        return trendingCache.data;
    }

    const response = await api.get('/menu/trending');
    const data: ApiResponse<MenuItem[]> = response.data;

    trendingCache.data = data;
    trendingCache.ts = Date.now();
    return data;
};

/** Call this if you need to force a fresh fetch (e.g. after admin edits) */
export const clearMenuCache = () => {
    menuCache.clear();
    trendingCache.data = null;
    trendingCache.ts = 0;
};
