import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Google icon ── */
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
);

type Tab = 'login' | 'signup';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/google`;

/* ── Field wrapper ── */
const Field: React.FC<{
    label: string;
    error?: string;
    children: React.ReactNode;
}> = ({ label, error, children }) => (
    <div>
        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.375rem' }}>
            {label}
        </label>
        {children}
        {error && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.25rem' }}>{error}</p>}
    </div>
);

/* ── Input row ── */
const InputRow: React.FC<{
    icon: React.ReactNode;
    error?: boolean;
    children: React.ReactNode;
    right?: React.ReactNode;
}> = ({ icon, error, children, right }) => (
    <div className={`auth-field-wrap${error ? ' error' : ''}`}>
        <span style={{ color: error ? '#ef4444' : '#94a3b8', flexShrink: 0, display: 'flex' }}>{icon}</span>
        {children}
        {right}
    </div>
);

/* ══════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════ */
const Login: React.FC = () => {
    const { login, register, loginWithToken, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [tab, setTab] = useState<Tab>('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPw, setShowPw] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiErr, setApiErr] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

    const from: string = (location.state as any)?.from?.pathname || '/';

    // Handle Google OAuth token in URL after redirect
    useEffect(() => {
        const tok = searchParams.get('token');
        if (!tok) return;
        loginWithToken(tok).then(() => navigate(from, { replace: true })).catch(() => {
            setApiErr('Google sign-in failed. Please try again.');
        });
    }, []); // only run once on mount

    // Already logged in
    useEffect(() => {
        if (isLoggedIn) navigate(from, { replace: true });
    }, [isLoggedIn]);

    const set = (k: string, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrors(p => ({ ...p, [k]: '' }));
        setApiErr('');
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (tab === 'signup' && !form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.password) e.password = 'Password is required';
        if (tab === 'signup' && form.password.length < 6) e.password = 'Minimum 6 characters';
        if (tab === 'signup' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setApiErr('');
        try {
            if (tab === 'login') {
                await login(form.email, form.password);
            } else {
                await register(form.name, form.email, form.password);
            }
            setSuccess(true);
            setTimeout(() => navigate(from, { replace: true }), 1200);
        } catch (err: any) {
            setApiErr(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const switchTab = (t: Tab) => { setTab(t); setErrors({}); setApiErr(''); setForm({ name: '', email: '', password: '', confirm: '' }); };

    return (
        <main style={{
            minHeight: '100vh',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '6rem 1rem 3rem',
        }}>
            <style>{`
                @keyframes authIn {
                    from { opacity: 0; transform: translateY(28px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes checkPop {
                    from { transform: scale(0); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .auth-field-wrap {
                    display: flex; align-items: center; gap: 0.625rem;
                    border: 1.5px solid rgba(220,88,62,0.2);
                    border-radius: 0.875rem; padding: 0 1rem; height: 48px;
                    background: rgba(255,244,241,0.5);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .auth-field-wrap:focus-within {
                    border-color: var(--color-solid);
                    box-shadow: 0 0 0 3px rgba(220,88,62,0.1);
                }
                .auth-field-wrap.error { border-color: #ef4444 !important; background: #fef2f2; box-shadow: none !important; }
                .auth-input {
                    flex: 1; background: transparent; border: none; outline: none;
                    font-size: 0.9375rem; font-family: inherit; color: var(--color-textColor); min-width: 0;
                }
                .auth-tab {
                    flex: 1; padding: 0.6rem; border: none; background: transparent;
                    font-size: 0.875rem; font-weight: 700; cursor: pointer;
                    border-radius: 0.625rem; transition: all 0.2s; color: var(--color-gray-500);
                }
                .auth-tab.active { background: white; color: var(--color-solid); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
                .google-btn:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.12) !important; transform: translateY(-1px) !important; }
            `}</style>

            <div style={{
                width: '100%', maxWidth: '440px',
                animation: mounted ? 'authIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            }}>
                {/* Branding */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <img src="/FoodieFiesta_files/logo-hvC0bAJS.svg" alt="Annapurna logo" style={{ height: '2.75rem' }} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--color-textColor)' }}>Annapurna</div>
                            <div style={{ fontWeight: 700, fontSize: '0.6rem', letterSpacing: '8px', textTransform: 'uppercase', color: 'var(--color-solid)' }}>Junction</div>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div style={{ background: 'white', borderRadius: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

                    {/* Gradient header */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                        padding: '1.75rem 1.75rem 2.5rem', position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '9999px', background: 'rgba(255,255,255,0.07)', top: '-90px', right: '-70px' }} />
                        <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', bottom: '-30px', left: '20%' }} />
                        <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.3rem', position: 'relative', zIndex: 1 }}>
                            {tab === 'login' ? 'Welcome Back! 👋' : 'Join Us 🍽️'}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
                            {tab === 'login'
                                ? 'Sign in to access your reservations and orders'
                                : 'Create an account for a richer dining experience'}
                        </p>
                    </div>

                    <div style={{ padding: '1.75rem' }}>

                        {/* ── Success state ── */}
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                <div style={{ animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both', display: 'inline-block', marginBottom: '1rem' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '9999px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(34,197,94,0.4)' }}>
                                        <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                                    {tab === 'login' ? 'Signed in!' : 'Account created!'}
                                </p>
                                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>Redirecting you now…</p>
                            </div>
                        ) : (
                            <>
                                {/* Tab switcher */}
                                <div style={{ display: 'flex', background: 'rgba(220,88,62,0.06)', borderRadius: '0.875rem', padding: '0.25rem', marginBottom: '1.5rem' }}>
                                    <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
                                    <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>Create Account</button>
                                </div>

                                {/* Google button */}
                                <a
                                    href={GOOGLE_AUTH_URL}
                                    className="google-btn"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                                        width: '100%', padding: '0.75rem', borderRadius: '0.875rem',
                                        border: '1.5px solid rgba(0,0,0,0.1)', background: 'white',
                                        fontWeight: 700, fontSize: '0.9rem', color: '#334155',
                                        textDecoration: 'none',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                        transition: 'box-shadow 0.2s, transform 0.2s',
                                        marginBottom: '1.25rem',
                                    }}
                                >
                                    <GoogleIcon />
                                    Continue with Google
                                </a>

                                {/* Divider */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>or continue with email</span>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                    {/* Name (signup only) */}
                                    {tab === 'signup' && (
                                        <Field label="Full Name *" error={errors.name}>
                                            <InputRow icon={<User size={16} />} error={!!errors.name}>
                                                <input className="auth-input" type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
                                            </InputRow>
                                        </Field>
                                    )}

                                    {/* Email */}
                                    <Field label="Email *" error={errors.email}>
                                        <InputRow icon={<Mail size={16} />} error={!!errors.email}>
                                            <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
                                        </InputRow>
                                    </Field>

                                    {/* Password */}
                                    <Field label="Password *" error={errors.password}>
                                        <InputRow icon={<Lock size={16} />} error={!!errors.password} right={
                                            <button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', flexShrink: 0 }}>
                                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        }>
                                            <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'} value={form.password} onChange={e => set('password', e.target.value)} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
                                        </InputRow>
                                    </Field>

                                    {/* Confirm password (signup only) */}
                                    {tab === 'signup' && (
                                        <Field label="Confirm Password *" error={errors.confirm}>
                                            <InputRow icon={<Lock size={16} />} error={!!errors.confirm}>
                                                <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirm} onChange={e => set('confirm', e.target.value)} autoComplete="new-password" />
                                            </InputRow>
                                        </Field>
                                    )}

                                    {/* API error */}
                                    {apiErr && (
                                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#dc2626', fontWeight: 600 }}>
                                            {apiErr}
                                        </div>
                                    )}

                                    {/* Admin hint */}
                                    {tab === 'login' && (
                                        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '0.75rem', padding: '0.625rem 0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                            <ShieldCheck size={14} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <p style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                                                Admin? Use your registered admin email &amp; password to access the admin panel.
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            marginTop: '0.25rem', width: '100%', padding: '0.875rem',
                                            borderRadius: '9999px', border: 'none',
                                            background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                                            color: 'white', fontWeight: 800, fontSize: '1rem',
                                            cursor: submitting ? 'wait' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            boxShadow: '0 4px 20px rgba(220,88,62,0.4)',
                                            opacity: submitting ? 0.78 : 1,
                                            transition: 'opacity 0.2s, transform 0.2s',
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '9999px', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                                                {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                                            </>
                                        ) : (
                                            <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={17} /></>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                    By continuing you agree to our{' '}
                    <span style={{ color: 'var(--color-solid)', fontWeight: 700 }}>Terms of Service</span>
                    {' '}and{' '}
                    <span style={{ color: 'var(--color-solid)', fontWeight: 700 }}>Privacy Policy</span>.
                </p>
            </div>
        </main>
    );
};

export default Login;
