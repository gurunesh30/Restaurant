import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * This page handles the redirect from Google OAuth.
 * The backend redirects to /login-success?token=<JWT>
 * We pick up the token, store it and redirect home.
 */
const LoginSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { loginWithToken } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const tok = searchParams.get('token');
        if (!tok) {
            setError('No token received from Google. Please try again.');
            return;
        }
        loginWithToken(tok)
            .then(() => navigate('/', { replace: true }))
            .catch(() => {
                setError('Google sign-in failed. Please try again.');
                setTimeout(() => navigate('/login', { replace: true }), 2500);
            });
    }, []);

    return (
        <main style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: '1.25rem',
            background: 'var(--color-primary)',
        }}>
            {error ? (
                <>
                    <div style={{ fontSize: '3rem' }}>😔</div>
                    <p style={{ fontWeight: 700, color: '#ef4444' }}>{error}</p>
                </>
            ) : (
                <>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '9999px',
                        border: '4px solid var(--color-solid)',
                        borderTopColor: 'transparent',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <p style={{ fontWeight: 700, color: 'var(--color-gray-500)', fontSize: '1rem' }}>
                        Signing you in…
                    </p>
                    <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
                </>
            )}
        </main>
    );
};

export default LoginSuccess;
