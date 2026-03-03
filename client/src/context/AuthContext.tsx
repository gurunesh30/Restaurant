import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/* ── Types ──────────────────────────────────────── */
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    picture?: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loginWithToken: (token: string) => Promise<void>;
}

/* ── Context ──────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'annapurna_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [loading, setLoading] = useState(true);

    // Set axios auth header whenever token changes
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem(TOKEN_KEY);
        }
    }, [token]);

    // Restore session on mount
    useEffect(() => {
        const restore = async () => {
            const saved = localStorage.getItem(TOKEN_KEY);
            if (!saved) { setLoading(false); return; }
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
                const res = await api.get('/auth/me');
                if (res.data.success) {
                    setUser(res.data.data);
                    setToken(saved);
                }
            } catch {
                localStorage.removeItem(TOKEN_KEY);
            } finally {
                setLoading(false);
            }
        };
        restore();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: tok, user: u } = res.data;
        setToken(tok);
        setUser(u);
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { token: tok, user: u } = res.data;
        setToken(tok);
        setUser(u);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    // Used after Google OAuth redirect lands a token via URL
    const loginWithToken = useCallback(async (tok: string) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
        setToken(tok);
        const res = await api.get('/auth/me');
        if (res.data.success) setUser(res.data.data);
    }, []);

    return (
        <AuthContext.Provider value={{
            user, token,
            isLoggedIn: !!user,
            isAdmin: user?.role === 'admin',
            loading,
            login, register, logout, loginWithToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};
