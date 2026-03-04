import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Layers, Star, Utensils, X, User, Phone,
    Mail, Users, Calendar, CheckCircle2, ChevronRight, Info,
    AlertCircle, RefreshCw, Loader2,
} from 'lucide-react';
import {
    fetchTables, createReservation,
    type ApiTable, type TableSection,
} from '../services/reservationService';

/* ─────────────────────────────────────────────────────────
   CONSTANTS
 ───────────────────────────────────────────────────────── */
type DisplayStatus = 'available' | 'booked' | 'mine' | 'unavailable';

interface BookingForm {
    name: string;
    phone: string;
    email: string;
    guests: string;
    date: string;
    time: string;
    specialReq: string;
}

const SECTION_DATA: Record<TableSection, { price: number; accent: string; label: string; icon: any }> = {
    'Ground': { price: 299, accent: '#60a5fa', label: 'Ground Floor', icon: Layers },
    'Lounge': { price: 499, accent: '#a78bfa', label: 'First Floor Lounge', icon: Utensils },
    'patio': { price: 699, accent: '#f59e0b', label: 'Sky Terrace', icon: Star },
};

const TIME_SLOTS = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
];

const TABLE_COLORS: Record<DisplayStatus, { bg: string; border: string; glow?: string; text: string; label: string }> = {
    available: { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', border: '#16a34a', glow: 'rgba(34,197,94,0.5)', text: 'white', label: 'Available' },
    booked: { bg: 'linear-gradient(135deg, #9ca3af, #6b7280)', border: '#6b7280', text: 'white', label: 'Booked' },
    unavailable: { bg: 'linear-gradient(135deg, #f87171, #dc2626)', border: '#dc2626', text: 'white', label: 'Closed' },
    mine: { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '#2563eb', glow: 'rgba(59,130,246,0.5)', text: 'white', label: 'Your Table' },
};

/* ─────────────────────────────────────────────────────────
   CHAIR HELPER
 ───────────────────────────────────────────────────────── */
const Chairs: React.FC<{ count: number; color: string; shape: ApiTable['shape'] }> = ({ count, color, shape }) => {
    const chairStyle: React.CSSProperties = {
        position: 'absolute', width: '10px', height: '10px',
        borderRadius: '3px', background: color, opacity: 0.7, transition: 'opacity 0.2s',
    };
    let positions: React.CSSProperties[] = [];

    if (shape === 'circle' || shape === 'square') {
        const radius = shape === 'circle' ? 38 : 42;
        positions = Array.from({ length: count }, (_, i) => {
            const angle = (i * (360 / count) - 90) * (Math.PI / 180);
            return { ...chairStyle, top: `calc(50% + ${radius * Math.sin(angle)}px - 5px)`, left: `calc(50% + ${radius * Math.cos(angle)}px - 5px)` };
        });
    } else {
        const half = Math.floor(count / 2);
        const spread = 110;
        const gap = half > 1 ? spread / (half - 1) : 0;
        const startOffset = half > 1 ? -spread / 2 : 0;
        for (let i = 0; i < half; i++) {
            const x = startOffset + i * gap;
            positions.push({ ...chairStyle, top: 'calc(50% - 35px)', left: `calc(50% + ${x}px - 5px)` });
        }
        for (let i = 0; i < half; i++) {
            const x = startOffset + i * gap;
            positions.push({ ...chairStyle, top: 'calc(50% + 25px)', left: `calc(50% + ${x}px - 5px)` });
        }
        if (count % 2 > 0) positions.push({ ...chairStyle, top: 'calc(50% - 5px)', left: 'calc(50% + 65px)' });
    }

    return <>{positions.map((s, i) => <div key={i} style={s} />)}</>;
};

/* ─────────────────────────────────────────────────────────
   TABLE CARD
 ───────────────────────────────────────────────────────── */
interface TableCardProps {
    table: ApiTable;
    displayStatus: DisplayStatus;
    onClick: (t: ApiTable) => void;
    justBooked?: boolean;
}

const TableCard: React.FC<TableCardProps> = ({ table, displayStatus, onClick, justBooked }) => {
    const [hovered, setHov] = useState(false);
    const cfg = TABLE_COLORS[displayStatus];
    const isClickable = displayStatus === 'available';

    let shapeStyles: React.CSSProperties = {};
    let containerSize = '120px';
    if (table.shape === 'circle') { shapeStyles = { width: '80px', height: '80px', borderRadius: '50%' }; containerSize = '130px'; }
    if (table.shape === 'square') { shapeStyles = { width: '90px', height: '90px', borderRadius: '12px' }; containerSize = '150px'; }
    if (table.shape === 'rectangle') { shapeStyles = { width: '130px', height: '50px', borderRadius: '8px' }; containerSize = '130px'; }

    return (
        <div
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            onClick={() => onClick(table)}
            style={{
                position: 'relative', cursor: isClickable ? 'pointer' : 'default',
                background: 'white', borderRadius: '1.25rem', padding: '1rem',
                border: `2px solid ${hovered && isClickable ? cfg.border : 'rgba(0,0,0,0.06)'}`,
                boxShadow: hovered && isClickable ? `0 8px 32px ${cfg.glow ?? 'rgba(0,0,0,0.12)'}` : justBooked ? `0 0 0 3px ${cfg.border}` : '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.28s ease',
                transform: hovered && isClickable ? 'translateY(-4px) scale(1.02)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                animation: justBooked ? 'tablePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : undefined,
                minHeight: '160px',
            }}
        >
            <div style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', background: cfg.bg, color: cfg.text, fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '9999px', boxShadow: cfg.glow ? `0 2px 8px ${cfg.glow}` : undefined }}>
                {cfg.label}
            </div>

            <div style={{ position: 'relative', height: containerSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...shapeStyles, background: cfg.border, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 10px ${cfg.border}33`, position: 'relative', opacity: displayStatus === 'booked' ? 0.6 : 1 }}>
                    <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800 }}>{table.label}</span>
                </div>
                <Chairs count={table.capacity} color={cfg.border} shape={table.shape} />
            </div>

            <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.15rem' }}>Table {table.tableNumber}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                    <Users size={10} /> {table.capacity} seats · {table.shape}
                </p>
            </div>

            {isClickable && (
                <div style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(4px)', transition: 'all 0.2s', background: cfg.bg, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: `0 2px 8px ${cfg.glow}`, position: 'absolute', bottom: '12px' }}>
                    Book <ChevronRight size={10} />
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   BOOKING MODAL
 ───────────────────────────────────────────────────────── */
const BookingModal: React.FC<{
    table: ApiTable;
    onClose: () => void;
    onConfirm: (form: BookingForm) => Promise<void>;
}> = ({ table, onClose, onConfirm }) => {
    const { price } = SECTION_DATA[table.section];
    const [form, setForm] = useState<BookingForm>({
        name: '', phone: '', email: '', guests: '1',
        date: new Date().toISOString().split('T')[0],
        time: TIME_SLOTS[0], specialReq: '',
    });
    const [errors, setErrors] = useState<Partial<BookingForm>>({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const validate = (): boolean => {
        const e: Partial<BookingForm> = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.date) e.date = 'Pick a date';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        setApiError(null);
        try {
            await onConfirm(form);
        } catch (err: any) {
            setApiError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const field = (key: keyof BookingForm, label: string, icon: React.ReactNode, type = 'text', placeholder = '') => (
        <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${errors[key] ? '#ef4444' : 'rgba(220,88,62,0.2)'}`, borderRadius: '0.75rem', padding: '0 0.875rem', height: '44px', gap: '0.5rem', background: errors[key] ? '#fef2f2' : 'rgba(255,244,241,0.5)', transition: 'border-color 0.2s' }}>
                <span style={{ color: 'var(--color-gray-400)', flexShrink: 0 }}>{icon}</span>
                <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: 'var(--color-textColor)' }} />
            </div>
            {errors[key] && <p style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors[key]}</p>}
        </div>
    );

    return (
        <div ref={backdropRef} onClick={e => { if (e.target === backdropRef.current) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.25s ease both' }}>
            <div style={{ background: 'white', borderRadius: '1.75rem', width: '100%', maxWidth: '480px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.25)', animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))', borderRadius: '1.75rem 1.75rem 0 0', padding: '1.5rem', position: 'relative' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '9999px', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}><X size={16} /></button>
                    <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>Reserve Table {table.tableNumber}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>Floor {table.floor} · {SECTION_DATA[table.section].label} · {table.capacity} seats · {table.shape}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', background: 'rgba(255,255,255,0.18)', borderRadius: '999px', padding: '0.35rem 0.5rem', color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>₹{price} per session</div>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {field('name', 'Full Name *', <User size={15} />, 'text', 'e.g. Arjun Sharma')}
                    {field('phone', 'Phone Number *', <Phone size={15} />, 'tel', '10-digit mobile number')}
                    {field('email', 'Email (optional)', <Mail size={15} />, 'email', 'your@email.com')}
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Number of Guests</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Array.from({ length: table.capacity }, (_, i) => i + 1).map(n => (
                                <button key={n} onClick={() => setForm(p => ({ ...p, guests: String(n) }))} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', border: form.guests === String(n) ? 'none' : '1.5px solid rgba(220,88,62,0.2)', background: form.guests === String(n) ? 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))' : 'rgba(255,244,241,0.5)', color: form.guests === String(n) ? 'white' : 'var(--color-textColor)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{n}</button>
                            ))}
                        </div>
                    </div>
                    {field('date', 'Date *', <Calendar size={15} />, 'date')}
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Time Slot</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {TIME_SLOTS.map(slot => (
                                <button key={slot} onClick={() => setForm(p => ({ ...p, time: slot }))} style={{ padding: '0.35rem 0.875rem', borderRadius: '9999px', border: form.time === slot ? 'none' : '1.5px solid rgba(220,88,62,0.2)', background: form.time === slot ? 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))' : 'white', color: form.time === slot ? 'white' : 'var(--color-textColor)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>{slot}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Special Requests</label>
                        <textarea rows={2} placeholder="Allergies, anniversary decoration, etc." value={form.specialReq} onChange={e => setForm(p => ({ ...p, specialReq: e.target.value }))} style={{ width: '100%', border: '1.5px solid rgba(220,88,62,0.2)', borderRadius: '0.75rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', resize: 'none', outline: 'none', background: 'rgba(255,244,241,0.5)', color: 'var(--color-textColor)', fontFamily: 'inherit' }} />
                    </div>

                    {apiError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>
                            <AlertCircle size={15} /> {apiError}
                        </div>
                    )}

                    <div style={{ background: 'rgba(220,88,62,0.06)', border: '1px solid rgba(220,88,62,0.18)', borderRadius: '0.875rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>
                            <div style={{ fontWeight: 600 }}>Table {table.tableNumber} · {table.capacity} seats</div>
                            <div>{form.date} at {form.time}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)' }}>Reservation fee</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-solidOne)' }}>₹{price}</div>
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: '0.875rem', borderRadius: '9999px', border: 'none', cursor: submitting ? 'wait' : 'pointer', background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))', color: 'white', fontSize: '1rem', fontWeight: 800, boxShadow: '0 4px 18px rgba(220,88,62,0.45)', transition: 'all 0.2s', opacity: submitting ? 0.75 : 1, transform: submitting ? 'scale(0.98)' : 'scale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {submitting
                            ? <><Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} /> Processing…</>
                            : <>Confirm Reservation — ₹{price} <ChevronRight size={18} /></>}
                    </button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   SUCCESS SCREEN
 ───────────────────────────────────────────────────────── */
const SuccessScreen: React.FC<{
    table: ApiTable;
    form: BookingForm;
    onDone: () => void;
}> = ({ table, form, onDone }) => {
    const { price } = SECTION_DATA[table.section];
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            {[...Array(12)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', width: Math.random() * 14 + 6 + 'px', height: Math.random() * 14 + 6 + 'px', borderRadius: '9999px', background: ['#dc583e', '#fd872f', '#22c55e', '#fbbf24', '#3b82f6'][i % 5], top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', animation: `confettiFly${i % 3} ${1.2 + Math.random() * 0.8}s ease-out both`, animationDelay: `${i * 0.05}s` }} />
            ))}
            <div style={{ background: 'white', borderRadius: '2rem', width: '100%', maxWidth: '420px', textAlign: 'center', padding: '2.5rem 2rem', boxShadow: '0 30px 80px rgba(0,0,0,0.3)', animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '9999px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 30px rgba(34,197,94,0.4)', animation: 'checkBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both' }}>
                    <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
                </div>
                <h2 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: '0.375rem' }}>Booking Confirmed! 🎉</h2>
                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Your table has been successfully reserved.</p>
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1.5px solid rgba(34,197,94,0.2)', borderRadius: '1.25rem', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                    {[
                        ['Table', `Table ${table.tableNumber} — ${SECTION_DATA[table.section].label}`],
                        ['Guest', form.name],
                        ['Phone', form.phone],
                        ['Guests', form.guests],
                        ['Date & Time', `${form.date} at ${form.time}`],
                        ['Amount', `₹${price}`],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8325rem' }}>
                            <span style={{ color: 'var(--color-gray-500)', fontWeight: 600 }}>{k}</span>
                            <span style={{ fontWeight: 700 }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solidTwo))', color: 'white', borderRadius: '1rem', padding: '1rem', fontWeight: 900, fontSize: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(220,88,62,0.35)', letterSpacing: '0.04em' }}>Table #{table.tableNumber}</div>
                <button onClick={onDone} style={{ width: '100%', padding: '0.875rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid))', color: 'white', fontSize: '1rem', fontWeight: 800, boxShadow: '0 4px 18px rgba(220,88,62,0.4)' }}>Done</button>
            </div>
            <style>{`
                @keyframes checkBounce { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes confettiFly0 { from { transform: translate(0,0) rotate(0); opacity: 1; } to { transform: translate(-80px, -200px) rotate(360deg); opacity: 0; } }
                @keyframes confettiFly1 { from { transform: translate(0,0) rotate(0); opacity: 1; } to { transform: translate(80px, -220px) rotate(-360deg); opacity: 0; } }
                @keyframes confettiFly2 { from { transform: translate(0,0) rotate(0); opacity: 1; } to { transform: translate(20px, -250px) rotate(180deg); opacity: 0; } }
                @keyframes tablePop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   LOADING SKELETON
 ───────────────────────────────────────────────────────── */
const TableSkeleton: React.FC = () => (
    <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1rem', minHeight: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9' }} />
        <div style={{ width: '60px', height: '12px', borderRadius: '9999px', background: '#f1f5f9' }} />
        <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }`}</style>
    </div>
);

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
 ───────────────────────────────────────────────────────── */

const FLOOR_CONFIG = [
    { id: 1 as const, label: 'Ground', icon: Layers, accent: '#60a5fa' },
    { id: 2 as const, label: 'Lounge', icon: Utensils, accent: '#a78bfa' },
    { id: 3 as const, label: 'Patio', icon: Star, accent: '#f59e0b' },
];

const SECTION_BY_FLOOR: Record<number, TableSection> = { 1: 'Ground', 2: 'Lounge', 3: 'patio' };

const Reservation: React.FC = () => {
    const [allTables, setAllTables] = useState<ApiTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selected, setSelected] = useState<ApiTable | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookedTable, setBookedTable] = useState<ApiTable | null>(null);
    const [bookedForm, setBookedForm] = useState<BookingForm | null>(null);
    const [justBookedId, setJustBookedId] = useState<string | null>(null);
    const [myBookedIds, setMyBookedIds] = useState<Set<string>>(new Set());
    const [alertMsg, setAlertMsg] = useState<string | null>(null);
    const [activeFloor, setActiveFloor] = useState<1 | 2 | 3>(1);

    // The selected date & time filters for availability
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterTime, setFilterTime] = useState(TIME_SLOTS[6]); // default 7:00 PM

    const loadTables = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTables(filterDate, filterTime);
            setAllTables(data);
        } catch (err: any) {
            setError('Could not load table data. Please check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterDate, filterTime]);

    useEffect(() => {
        loadTables();
    }, [loadTables]);

    const floorTables = allTables.filter(t => t.floor === activeFloor);
    const currentSection = SECTION_BY_FLOOR[activeFloor];

    const getDisplayStatus = (t: ApiTable): DisplayStatus => {
        if (myBookedIds.has(t._id)) return 'mine';
        if (t.status === 'unavailable') return 'unavailable';
        if (t.status === 'booked') return 'booked';
        return 'available';
    };

    const handleTableClick = (t: ApiTable) => {
        const status = getDisplayStatus(t);
        if (status === 'mine') {
            setAlertMsg(`Table ${t.tableNumber} is your reserved table!`);
            setTimeout(() => setAlertMsg(null), 3500);
            return;
        }
        if (status === 'booked') {
            setAlertMsg(`Table ${t.tableNumber} is already booked for this time slot.`);
            setTimeout(() => setAlertMsg(null), 3500);
            return;
        }
        if (status === 'unavailable') {
            setAlertMsg(`Table ${t.tableNumber} is temporarily closed.`);
            setTimeout(() => setAlertMsg(null), 3500);
            return;
        }
        setSelected(t);
    };

    const handleConfirm = async (form: BookingForm) => {
        if (!selected) return;

        await createReservation({
            customerName: form.name,
            customerPhone: form.phone,
            customerEmail: form.email || undefined,
            tableId: selected._id,
            date: form.date,
            time: form.time,
            guests: Number(form.guests),
            notes: form.specialReq || undefined,
        });

        // Mark this table as "mine" locally
        setMyBookedIds(prev => new Set(Array.from(prev).concat(selected._id)));

        // Optimistically update table status in the list
        setAllTables(prev => prev.map(t => t._id === selected._id ? { ...t, status: 'booked' } : t));

        setBookedTable(selected);
        setBookedForm(form);
        setJustBookedId(selected._id);
        setSelected(null);
        setShowSuccess(true);
        setTimeout(() => setJustBookedId(null), 1200);
    };

    const sectionInfo = SECTION_DATA[currentSection];
    const availableCount = floorTables.filter(t => getDisplayStatus(t) === 'available').length;

    return (
        <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingTop: '5.5rem' }}>
            {/* Alert Toast */}
            {alertMsg && (
                <div style={{ position: 'fixed', top: '5.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: 'white', borderLeft: '4px solid #ef4444', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', boxShadow: '0 8px 30px rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeInUp 0.3s ease both', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <AlertCircle size={16} color="#ef4444" /> {alertMsg}
                </div>
            )}

            {/* Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #1e293b 100%)', padding: '3rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '9999px', background: 'white', opacity: 0.06, top: '-100px', right: '-80px' }} />
                    <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '9999px', background: 'white', opacity: 0.05, bottom: '-70px', left: '-50px' }} />
                </div>
                <div className="padd-container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '0.5rem' }}>Reserve Your Table</h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '36rem', lineHeight: 1.6 }}>
                        Pick a date and time, then choose your favourite table across our three floors.
                    </p>

                    {/* Date / Time filter row */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.5rem 0.875rem' }}>
                            <Calendar size={14} color="rgba(255,255,255,0.8)" />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={e => setFilterDate(e.target.value)}
                                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '0.875rem', fontWeight: 600, colorScheme: 'dark' }}
                            />
                        </div>
                        <select
                            value={filterTime}
                            onChange={e => setFilterTime(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', outline: 'none', color: 'white', fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem 0.875rem', borderRadius: '0.75rem', cursor: 'pointer' }}
                        >
                            {TIME_SLOTS.map(s => <option key={s} value={s} style={{ color: '#1e293b' }}>{s}</option>)}
                        </select>
                        <button onClick={loadTables} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none', background: 'rgba(255,255,255,0.18)', color: 'white', fontSize: '0.8rem', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
                            <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} /> Check Availability
                        </button>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
                            {[{ color: '#22c55e', label: 'Available' }, { color: '#6b7280', label: 'Booked' }, { color: '#3b82f6', label: 'Yours' }].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: l.color }} />
                                    <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.78rem', fontWeight: 600 }}>{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floor Tabs */}
            <div className="padd-container" style={{ marginTop: '-1.5rem', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'inline-flex', background: 'white', padding: '0.35rem', borderRadius: '9999px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', gap: '0.25rem' }}>
                    {FLOOR_CONFIG.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFloor(f.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                                borderRadius: '9999px', border: 'none',
                                background: activeFloor === f.id ? 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid))' : 'transparent',
                                color: activeFloor === f.id ? 'white' : 'var(--color-gray-600)',
                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: activeFloor === f.id ? '0 4px 12px rgba(220,88,62,0.3)' : 'none',
                            }}
                        >
                            {React.createElement(f.icon, { size: 16 })} {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Price Info Bar */}
            <div className="padd-container" style={{ marginTop: '-1px', zIndex: 5 }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'white', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                    {(Object.entries(SECTION_DATA) as [TableSection, any][]).map(([key, data]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: '1 1 240px' }}>
                            <div style={{ padding: '0.625rem', background: `${data.accent}12`, borderRadius: '0.75rem' }}>{React.createElement(data.icon, { size: 18, color: data.accent })}</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{data.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>Premium Dining · {key}</div>
                            </div>
                            <div style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '1rem' }}>₹{data.price}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floor Plan */}
            <section className="padd-container" style={{ marginTop: '2.5rem', paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.5rem', background: `${sectionInfo.accent}18`, borderRadius: '0.625rem' }}>
                        {React.createElement(sectionInfo.icon, { size: 20, color: sectionInfo.accent })}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{sectionInfo.label}</h2>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-gray-400)' }}>
                            {activeFloor === 1 ? '❄️ Main Dining Hall' : activeFloor === 2 ? '🍸 Lounge & Bar Area' : '🌟 Sky Terrace'}
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Info size={13} />
                        {loading ? 'Loading…' : `${availableCount} available`}
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '1.5rem', border: `3px solid ${sectionInfo.accent}20`, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '0.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 700, color: `${sectionInfo.accent}80`, letterSpacing: '0.15em', textTransform: 'uppercase' }}>🚪 Entrance</div>

                    {/* Error state */}
                    {error && !loading && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                            <AlertCircle size={40} style={{ margin: '0 auto 1rem' }} />
                            <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{error}</p>
                            <button onClick={loadTables} style={{ padding: '0.5rem 1.5rem', borderRadius: '9999px', background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid))', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
                        </div>
                    )}

                    {/* Table grid */}
                    {!error && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => <TableSkeleton key={i} />)
                                : floorTables.map(t => (
                                    <TableCard
                                        key={t._id}
                                        table={t}
                                        displayStatus={getDisplayStatus(t)}
                                        onClick={handleTableClick}
                                        justBooked={t._id === justBookedId}
                                    />
                                ))
                            }
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.65rem', fontWeight: 700, color: `${sectionInfo.accent}65`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>🧱 End of Floor</div>
                </div>
            </section>

            {/* Modals */}
            {selected && (
                <BookingModal
                    table={selected}
                    onClose={() => setSelected(null)}
                    onConfirm={handleConfirm}
                />
            )}
            {showSuccess && bookedTable && bookedForm && (
                <SuccessScreen
                    table={bookedTable}
                    form={bookedForm}
                    onDone={() => { setShowSuccess(false); loadTables(); }}
                />
            )}

            <style>{`
                @keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
                @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
                @keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
                @keyframes spin { to { transform:rotate(360deg); } }
            `}</style>
        </main>
    );
};

export default Reservation;