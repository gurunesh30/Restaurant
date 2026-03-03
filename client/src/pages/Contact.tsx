import React, { useState, useEffect, useRef } from 'react';
import {
    User, Mail, Phone, Send,
    CheckCircle2, ChevronDown, MapPin, Clock, Instagram,
    Facebook, Twitter,
} from 'lucide-react';
import api from '../services/api';

/* ── Types ──────────────────────────────────────── */
type Purpose = 'general' | 'reservation' | 'feedback' | 'complaint' | 'catering' | 'other';

interface FormState {
    name: string;
    email: string;
    phone: string;
    purpose: Purpose;
    message: string;
}

/* ── Purpose options ────────────────────────────── */
const PURPOSE_OPTIONS: { value: Purpose; label: string; emoji: string }[] = [
    { value: 'general', label: 'General Inquiry', emoji: '💬' },
    { value: 'reservation', label: 'Reservation Help', emoji: '🪑' },
    { value: 'feedback', label: 'Feedback & Suggestions', emoji: '⭐' },
    { value: 'complaint', label: 'Complaint', emoji: '⚠️' },
    { value: 'catering', label: 'Catering & Events', emoji: '🍽️' },
    { value: 'other', label: 'Other', emoji: '📋' },
];

/* ── Animated field progress bar ─────────────────
   Fills left→right proportionally to how many of the 
   4 text fields have non-empty values.
────────────────────────────────────────────────── */
const FormProgress: React.FC<{ filled: number; total: number }> = ({ filled, total }) => {
    const pct = total === 0 ? 0 : Math.round((filled / total) * 100);

    return (
        <div style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            height: '6px',
            background: 'rgba(0,0,0,0.1)',
            overflow: 'hidden',
        }}>
            <div
                style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: `${pct}%`,
                    background: pct === 100 ? '#22c55e' : 'linear-gradient(90deg, var(--color-solidOne), var(--color-solid))',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '0 0 0 0',
                }}
            />
        </div>
    );
};

/* ── Individual animated field wrapper ────────────── */
const AnimField: React.FC<{
    children: React.ReactNode;
    visible: boolean;
    delay?: number;
}> = ({ children, visible, delay = 0 }) => (
    <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.45s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.45s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>
        {children}
    </div>
);

/* ── Success overlay ────────────────────────────── */
const SuccessScreen: React.FC<{ name: string; onReset: () => void }> = ({ name, onReset }) => (
    <div style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'white',
        borderRadius: '1.75rem',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem',
        animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        textAlign: 'center',
    }}>
        {/* Ripple rings */}
        {[1, 2, 3].map(i => (
            <div key={i} style={{
                position: 'absolute',
                width: `${80 + i * 50}px`, height: `${80 + i * 50}px`,
                borderRadius: '9999px',
                border: '2px solid rgba(34,197,94,0.3)',
                animation: `ripple 1.8s ease-out ${(i - 1) * 0.3}s infinite`,
                pointerEvents: 'none',
            }} />
        ))}

        {/* Check icon */}
        <div style={{
            width: '80px', height: '80px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(34,197,94,0.4)',
            animation: 'checkBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.2s both',
            marginBottom: '1.75rem',
            position: 'relative', zIndex: 1,
        }}>
            <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
        </div>

        <h2 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: '0.5rem' }}>Message Sent! 🎉</h2>
        <p style={{ color: 'var(--color-gray-500)', maxWidth: '22rem', lineHeight: 1.6, marginBottom: '0.25rem' }}>
            Thank you, <strong>{name}</strong>! We've received your message and will get back to you within 24 hours.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginBottom: '2rem' }}>
            Keep an eye on your inbox (and spam folder 😉)
        </p>

        <button
            onClick={onReset}
            style={{
                padding: '0.75rem 2.5rem',
                borderRadius: '9999px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                color: 'white', fontWeight: 800, fontSize: '0.9375rem',
                boxShadow: '0 4px 18px rgba(220,88,62,0.4)',
            }}
        >
            Send Another Message
        </button>

        <style>{`
            @keyframes ripple {
                0%   { transform: scale(0.6); opacity: 0.8; }
                100% { transform: scale(1.8); opacity: 0; }
            }
            @keyframes checkBounce {
                from { transform: scale(0); opacity: 0; }
                to   { transform: scale(1); opacity: 1; }
            }
        `}</style>
    </div>
);

/* ══════════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════════ */
const EMPTY_FORM: FormState = {
    name: '', email: '', phone: '', purpose: 'general', message: '',
};

const Contact: React.FC = () => {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [focused, setFocused] = useState<keyof FormState | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [purposeOpen, setPurposeOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const purposeRef = useRef<HTMLDivElement>(null);

    // Animate fields in on mount
    useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

    // Close purpose dropdown on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (purposeRef.current && !purposeRef.current.contains(e.target as Node))
                setPurposeOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // Compute progress based on 4 text fields
    const REQUIRED_FIELDS: (keyof FormState)[] = ['name', 'email', 'phone', 'message'];
    const filledCount = REQUIRED_FIELDS.filter(k => form[k].trim().length > 0).length;
    const totalFields = REQUIRED_FIELDS.length;

    const set = (k: keyof FormState, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
    };

    const validate = (): boolean => {
        const e: Partial<Record<keyof FormState, string>> = {};
        if (!form.name.trim()) e.name = 'Please enter your name';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
        if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/[\s\-]/g, ''))) e.phone = 'Enter a valid 10-digit number';
        if (!form.message.trim()) e.message = 'Please write a message';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setApiError(null);
        try {
            await api.post('/contact', form);
            setSubmitted(true);
        } catch (err: any) {
            setApiError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setSubmitted(false);
        setApiError(null);
    };

    /* ── Field renderer helpers ── */
    const inputStyle = (): React.CSSProperties => ({
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        fontSize: '0.9375rem', color: 'var(--color-textColor)', fontFamily: 'inherit',
    });

    const wrapStyle = (key: keyof FormState): React.CSSProperties => ({
        display: 'flex', alignItems: 'center',
        border: `1.5px solid ${errors[key] ? '#ef4444' : focused === key ? 'var(--color-solid)' : 'rgba(220,88,62,0.18)'}`,
        borderRadius: '0.875rem',
        padding: '0 1rem', height: '52px', gap: '0.625rem',
        background: errors[key] ? '#fef2f2' : focused === key ? 'rgba(255,244,241,0.7)' : 'rgba(255,244,241,0.4)',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
        boxShadow: focused === key && !errors[key] ? '0 0 0 3px rgba(220,88,62,0.1)' : 'none',
    });

    const iconColor = (key: keyof FormState) =>
        errors[key] ? '#ef4444' : focused === key ? 'var(--color-solid)' : 'var(--color-gray-400)';

    const selectedPurpose = PURPOSE_OPTIONS.find(p => p.value === form.purpose)!;

    return (
        <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingTop: '5.5rem' }}>

            <div style={{
                background: 'linear-gradient(135deg, var(--color-solidOne) 0%, var(--color-solid) 55%, var(--color-solidTwo) 100%)',
                padding: '3rem 0 5.5rem',
                position: 'relative', overflow: 'hidden',
            }}>
                {[
                    { s: 300, top: '-90px', right: '-70px', o: 0.07 },
                    { s: 170, bottom: '-60px', left: '-40px', o: 0.06 },
                    { s: 110, top: '30px', left: '25%', o: 0.05 },
                ].map((c: any, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: c.s, height: c.s, borderRadius: '9999px',
                        background: 'white', opacity: c.o,
                        top: c.top, bottom: c.bottom, left: c.left, right: c.right,
                    }} />
                ))}
                <div className="padd-container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="animate-fadeInUp" style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.25rem)' }}>
                        Get in Touch
                    </h1>
                    <p className="animate-fadeInUp delay-100" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '34rem', lineHeight: 1.65, marginTop: '0.5rem' }}>
                        Have a question, feedback, or just want to say hello? We'd love to hear from you — fill in the form and we'll respond within 24 hours.
                    </p>
                </div>
            </div>

            <div className="padd-container contact-grid" style={{
                marginTop: '-3rem',
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.55fr)',
                gap: '1.75rem',
                paddingBottom: '5rem',
                alignItems: 'start',
            }}>

                {/* Info panel */}
                <div className="animate-slideLeft" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.75rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>Contact Information</h3>
                        {[
                            { icon: <MapPin size={17} />, label: 'Address', val: '12, Annapurna Lane, Udumalai road, Pollachi' },
                            { icon: <Phone size={17} />, label: 'Phone', val: '+91 93960 220856' },
                            { icon: <Mail size={17} />, label: 'Email', val: 'vignesh112847@gmail.com' },
                            { icon: <Clock size={17} />, label: 'Hours', val: 'Mon–Sun: 11 AM – 11 PM' },
                        ].map((row, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.875rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.5rem', background: 'rgba(220,88,62,0.08)', borderRadius: '0.625rem', color: 'var(--color-solid)', flexShrink: 0 }}>
                                    {row.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>
                                        {row.label}
                                    </div>
                                    <div style={{ fontSize: '0.8375rem', fontWeight: 600, color: 'var(--color-textColor)', lineHeight: 1.45 }}>{row.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {[
                                { icon: <Instagram size={18} />, bg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
                                { icon: <Facebook size={18} />, bg: '#1877f2' },
                                { icon: <Twitter size={18} />, bg: '#1da1f2' },
                            ].map((s, i) => (
                                <a key={i} href="#" style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                                    background: s.bg, color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                        height: '180px', background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem',
                        color: 'var(--color-gray-500)', fontSize: '0.875rem', fontWeight: 600,
                    }}>
                        <MapPin size={28} color="var(--color-solid)" />
                        <span>12, Annapurna Lane, Udumalai road</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Pollachi, Tamil Nadu</span>
                    </div>
                </div>

                {/* Form card */}
                <div className="animate-slideRight" style={{
                    background: 'white', borderRadius: '1.75rem', boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
                    position: 'relative', zIndex: 2,
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b, #334155)',
                        padding: '1.5rem 1.75rem 0', position: 'relative', borderRadius: '1.75rem 1.75rem 0 0', overflow: 'hidden'
                    }}>
                        <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.25rem' }}>Send a Message</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '1.125rem' }}>Fill in all fields and we'll reply promptly</p>
                        <FormProgress filled={filledCount} total={totalFields} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <AnimField visible={mounted} delay={0}>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Full Name <span style={{ color: 'var(--color-solid)' }}>*</span></label>
                            <div style={wrapStyle('name')}>
                                <User size={16} color={iconColor('name')} />
                                <input style={inputStyle()} type="text" placeholder="e.g. Arjun Krishnan" value={form.name} onChange={e => set('name', e.target.value)} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
                            </div>
                            {errors.name && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.name}</p>}
                        </AnimField>

                        <AnimField visible={mounted} delay={70}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Email <span style={{ color: 'var(--color-solid)' }}>*</span></label>
                                    <div style={wrapStyle('email')}>
                                        <Mail size={16} color={iconColor('email')} />
                                        <input style={{ ...inputStyle(), minWidth: 0 }} type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
                                    </div>
                                    {errors.email && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.email}</p>}
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Phone <span style={{ color: 'var(--color-solid)' }}>*</span></label>
                                    <div style={wrapStyle('phone')}>
                                        <Phone size={16} color={iconColor('phone')} />
                                        <input style={{ ...inputStyle(), minWidth: 0 }} type="tel" placeholder="10-digit number" value={form.phone} onChange={e => set('phone', e.target.value)} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
                                    </div>
                                    {errors.phone && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.phone}</p>}
                                </div>
                            </div>
                        </AnimField>

                        <div style={{ position: 'relative', zIndex: purposeOpen ? 100 : 10 }}>
                            <AnimField visible={mounted} delay={140}>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Purpose of Contact</label>
                                <div ref={purposeRef} style={{ position: 'relative' }}>
                                    <button type="button" onClick={() => setPurposeOpen(v => !v)} style={{
                                        width: '100%', height: '52px', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 1rem',
                                        border: `1.5px solid ${purposeOpen ? 'var(--color-solid)' : 'rgba(220,88,62,0.18)'}`,
                                        borderRadius: purposeOpen ? '0.875rem 0.875rem 0 0' : '0.875rem', background: 'white', cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: purposeOpen ? '0 0 0 3px rgba(220,88,62,0.1)' : 'none',
                                    }}>
                                        <span style={{ fontSize: '1rem' }}>{selectedPurpose.emoji}</span>
                                        <span style={{ flex: 1, textAlign: 'left', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-textColor)' }}>{selectedPurpose.label}</span>
                                        <ChevronDown size={16} color="var(--color-gray-400)" style={{ transition: 'transform 0.25s', transform: purposeOpen ? 'rotate(180deg)' : 'none' }} />
                                    </button>
                                    {purposeOpen && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 110, background: 'white', border: '1.5px solid var(--color-solid)', borderTop: 'none',
                                            borderRadius: '0 0 0.875rem 0.875rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', overflow: 'hidden', animation: 'fadeInUp 0.18s ease both',
                                        }}>
                                            {PURPOSE_OPTIONS.map(opt => (
                                                <button key={opt.value} type="button" onClick={() => { set('purpose', opt.value); setPurposeOpen(false); }} style={{
                                                    width: '100%', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.625rem',
                                                    background: form.purpose === opt.value ? 'rgba(220,88,62,0.12)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                                                    fontSize: '0.9375rem', fontWeight: form.purpose === opt.value ? 700 : 500, color: 'var(--color-textColor)', transition: 'background 0.15s',
                                                }}
                                                    onMouseEnter={e => { if (form.purpose !== opt.value) (e.currentTarget as HTMLElement).style.background = '#f1f5f9'; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = form.purpose === opt.value ? 'rgba(220,88,62,0.12)' : 'transparent'; }}
                                                >
                                                    <span style={{ fontSize: '1.1rem' }}>{opt.emoji}</span>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </AnimField>
                        </div>

                        <AnimField visible={mounted} delay={210}>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>
                                Message <span style={{ color: 'var(--color-solid)' }}>*</span>
                                <span style={{ float: 'right', fontWeight: 500, color: 'var(--color-gray-400)' }}>{form.message.length}/1000</span>
                            </label>
                            <textarea rows={4} maxLength={1000} placeholder="Tell us how we can help you…" value={form.message} onChange={e => set('message', e.target.value)} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} style={{
                                width: '100%', resize: 'vertical', border: `1.5px solid ${errors.message ? '#ef4444' : focused === 'message' ? 'var(--color-solid)' : 'rgba(220,88,62,0.18)'}`,
                                borderRadius: '0.875rem', padding: '0.875rem 1rem', fontSize: '0.9375rem', fontFamily: 'inherit',
                                background: errors.message ? '#fef2f2' : focused === 'message' ? 'rgba(255,244,241,0.7)' : 'rgba(255,244,241,0.4)',
                                color: 'var(--color-textColor)', outline: 'none', transition: 'all 0.25s', minHeight: '120px',
                                boxShadow: focused === 'message' && !errors.message ? '0 0 0 3px rgba(220,88,62,0.1)' : 'none',
                            }} />
                            {errors.message && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.message}</p>}
                        </AnimField>

                        {apiError && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#dc2626', fontWeight: 600 }}>{apiError}</div>
                        )}

                        <AnimField visible={mounted} delay={280}>
                            <button type="submit" disabled={submitting} style={{
                                width: '100%', padding: '0.9rem', borderRadius: '9999px', border: 'none',
                                background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                                color: 'white', fontWeight: 800, fontSize: '1rem', cursor: submitting ? 'wait' : 'pointer',
                                boxShadow: '0 4px 20px rgba(220,88,62,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                opacity: submitting ? 0.75 : 1, transform: submitting ? 'scale(0.98)' : 'scale(1)', transition: 'all 0.2s',
                            }}>
                                {submitting ? (
                                    <>
                                        <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '9999px', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                                        Sending…
                                    </>
                                ) : (
                                    <><Send size={17} strokeWidth={2.5} /> Send Message</>
                                )}
                            </button>
                        </AnimField>
                    </form>

                    {submitted && <SuccessScreen name={form.name} onReset={handleReset} />}
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .contact-grid { grid-template-columns: minmax(0,1fr) minmax(0,1.55fr); }
                @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </main>
    );
};

export default Contact;
