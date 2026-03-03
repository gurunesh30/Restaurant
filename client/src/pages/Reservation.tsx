import React, { useState, useRef } from 'react';
import {
    Wind, ThermometerSun, X, User, Phone,
    Mail, Users, Calendar, CheckCircle2, ChevronRight, Info,
    AlertCircle,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type Section = 'AC' | 'NON_AC';
type TableStatus = 'available' | 'booked' | 'mine';

interface Table {
    id: string;
    number: number;
    section: Section;
    seats: number;
    status: TableStatus;
    bookedBy?: string;
}

interface BookingForm {
    name: string;
    phone: string;
    email: string;
    guests: string;
    date: string;
    time: string;
    specialReq: string;
}

/* ─────────────────────────────────────────────────────────
   MOCK DATA  (12 tables — 6 AC, 6 Non-AC)
───────────────────────────────────────────────────────── */
const AC_PRICE = 499;
const NON_AC_PRICE = 299;

const INITIAL_TABLES: Table[] = [
    // ── AC Section — 8 seats each — top row (T1–T7)
    { id: 'a1', number: 1, section: 'AC', seats: 8, status: 'available' },
    { id: 'a2', number: 2, section: 'AC', seats: 8, status: 'booked', bookedBy: 'Rahul Mehta' },
    { id: 'a3', number: 3, section: 'AC', seats: 8, status: 'available' },
    { id: 'a4', number: 4, section: 'AC', seats: 8, status: 'booked', bookedBy: 'Priya Sharma' },
    { id: 'a5', number: 5, section: 'AC', seats: 8, status: 'available' },
    { id: 'a6', number: 6, section: 'AC', seats: 8, status: 'available' },
    { id: 'a7', number: 7, section: 'AC', seats: 8, status: 'booked', bookedBy: 'Kiran Desai' },
    // ── AC Section — right column (T8–T12) going downward
    { id: 'a8', number: 8, section: 'AC', seats: 8, status: 'available' },
    { id: 'a9', number: 9, section: 'AC', seats: 8, status: 'available' },
    // ── Non-AC Section — 4 seats each — 4 rows of 4
    { id: 'n1', number: 13, section: 'NON_AC', seats: 4, status: 'available' },
    { id: 'n2', number: 14, section: 'NON_AC', seats: 4, status: 'booked', bookedBy: 'Anil Kumar' },
    { id: 'n3', number: 15, section: 'NON_AC', seats: 4, status: 'available' },
    { id: 'n4', number: 16, section: 'NON_AC', seats: 4, status: 'available' },
    { id: 'n5', number: 17, section: 'NON_AC', seats: 4, status: 'booked', bookedBy: 'Sneha Patel' },
    { id: 'n6', number: 18, section: 'NON_AC', seats: 4, status: 'available' },
    { id: 'n7', number: 19, section: 'NON_AC', seats: 4, status: 'available' },
    { id: 'n8', number: 20, section: 'NON_AC', seats: 4, status: 'available' },
];

const TIME_SLOTS = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
];



/* ─────────────────────────────────────────────────────────
   TABLE CARD
───────────────────────────────────────────────────────── */
const TABLE_COLORS: Record<TableStatus, { bg: string; border: string; glow?: string; text: string; label: string }> = {
    available: {
        bg: 'linear-gradient(135deg, #22c55e, #16a34a)',
        border: '#16a34a',
        glow: 'rgba(34,197,94,0.5)',
        text: 'white',
        label: 'Available',
    },
    booked: {
        bg: 'linear-gradient(135deg, #9ca3af, #6b7280)',
        border: '#6b7280',
        text: 'white',
        label: 'Booked',
    },
    mine: {
        bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        border: '#2563eb',
        glow: 'rgba(59,130,246,0.5)',
        text: 'white',
        label: 'Your Table',
    },
};

const TableCard: React.FC<{
    table: Table;
    onClick: (t: Table) => void;
    justBooked?: boolean;
}> = ({ table, onClick, justBooked }) => {
    const [hovered, setHov] = useState(false);
    const cfg = TABLE_COLORS[table.status];
    const isClickable = table.status === 'available';

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={() => onClick(table)}
            style={{
                position: 'relative',
                cursor: isClickable ? 'pointer' : 'default',
                background: 'white',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                border: `2px solid ${hovered && isClickable ? cfg.border : 'rgba(0,0,0,0.06)'}`,
                boxShadow: hovered && isClickable
                    ? `0 8px 32px ${cfg.glow ?? 'rgba(0,0,0,0.12)'}`
                    : justBooked ? `0 0 0 3px ${cfg.border}` : '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.28s ease',
                transform: hovered && isClickable ? 'translateY(-4px) scale(1.02)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                animation: justBooked ? 'tablePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : undefined,
            }}
        >
            {/* Status pill */}
            <div style={{
                position: 'absolute',
                top: '0.625rem',
                right: '0.625rem',
                background: cfg.bg,
                color: cfg.text,
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                boxShadow: cfg.glow ? `0 2px 8px ${cfg.glow}` : undefined,
            }}>
                {cfg.label}
            </div>

            {/* SVG Table */}
            <div style={{ position: 'relative' }}>
                {/* Coloured circle behind SVG */}
                <div style={{
                    width: table.seats === 8 ? '130px' : '110px',
                    height: '90px',
                    borderRadius: '1rem',
                    background: `${cfg.bg}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1.5px solid ${cfg.border}44`,
                    transition: 'background 0.3s',
                }}>
                    {/* Seat icons grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        {/* top row */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: table.seats === 8 ? 4 : 2 }).map((_, i) => (
                                <div key={`t${i}`} style={{
                                    width: '16px', height: '16px',
                                    borderRadius: '4px 4px 0 0',
                                    background: cfg.border,
                                    opacity: table.status === 'booked' ? 0.45 : 0.85,
                                }} />
                            ))}
                        </div>
                        {/* table body */}
                        <div style={{
                            width: table.seats === 8 ? '88px' : '52px',
                            height: '28px',
                            borderRadius: '6px',
                            background: cfg.border,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: table.status === 'booked' ? 0.5 : 1,
                        }}>
                            <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>T{table.number}</span>
                        </div>
                        {/* bottom row */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: table.seats === 8 ? 4 : 2 }).map((_, i) => (
                                <div key={`b${i}`} style={{
                                    width: '16px', height: '16px',
                                    borderRadius: '0 0 4px 4px',
                                    background: cfg.border,
                                    opacity: table.status === 'booked' ? 0.45 : 0.85,
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div style={{ textAlign: 'center', width: '100%' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--color-textColor)' }}>
                    Table {table.number}
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                    <Users size={10} />
                    {table.seats} seats
                </p>
                {table.status === 'booked' && table.bookedBy && (
                    <p style={{ fontSize: '0.68rem', color: 'var(--color-gray-400)', marginTop: '0.15rem', fontStyle: 'italic' }}>
                        {table.bookedBy}
                    </p>
                )}
            </div>

            {/* Hover CTA */}
            {isClickable && (
                <div style={{
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'translateY(0)' : 'translateY(4px)',
                    transition: 'all 0.2s',
                    background: cfg.bg,
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.875rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    boxShadow: `0 2px 8px ${cfg.glow}`,
                }}>
                    Book Now <ChevronRight size={11} />
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   BOOKING MODAL
───────────────────────────────────────────────────────── */
const BookingModal: React.FC<{
    table: Table;
    onClose: () => void;
    onConfirm: (form: BookingForm) => void;
}> = ({ table, onClose, onConfirm }) => {
    const price = table.section === 'AC' ? AC_PRICE : NON_AC_PRICE;
    const [form, setForm] = useState<BookingForm>({
        name: '', phone: '', email: '', guests: '1',
        date: new Date().toISOString().split('T')[0],
        time: TIME_SLOTS[0],
        specialReq: '',
    });
    const [errors, setErrors] = useState<Partial<BookingForm>>({});
    const [submitting, setSubmitting] = useState(false);
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

    const handleSubmit = () => {
        if (!validate()) return;
        setSubmitting(true);
        setTimeout(() => { onConfirm(form); setSubmitting(false); }, 900);
    };

    const field = (
        key: keyof BookingForm,
        label: string,
        icon: React.ReactNode,
        type = 'text',
        placeholder = '',
    ) => (
        <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>
                {label}
            </label>
            <div style={{
                display: 'flex', alignItems: 'center',
                border: `1.5px solid ${errors[key] ? '#ef4444' : 'rgba(220,88,62,0.2)'}`,
                borderRadius: '0.75rem', padding: '0 0.875rem', height: '44px', gap: '0.5rem',
                background: errors[key] ? '#fef2f2' : 'rgba(255,244,241,0.5)',
                transition: 'border-color 0.2s',
            }}>
                <span style={{ color: 'var(--color-gray-400)', flexShrink: 0 }}>{icon}</span>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: 'var(--color-textColor)' }}
                />
            </div>
            {errors[key] && <p style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors[key]}</p>}
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={e => { if (e.target === backdropRef.current) onClose(); }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                    animation: 'fadeIn 0.25s ease both',
                }}
            >
                {/* Modal */}
                <div style={{
                    background: 'white',
                    borderRadius: '1.75rem',
                    width: '100%', maxWidth: '480px',
                    maxHeight: '92vh', overflowY: 'auto',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
                    animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                        borderRadius: '1.75rem 1.75rem 0 0',
                        padding: '1.5rem',
                        position: 'relative',
                    }}>
                        <button onClick={onClose} style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '9999px',
                            width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white',
                        }}><X size={16} /></button>
                        <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>
                            Reserve Table {table.number}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                            {table.section === 'AC' ? '❄️ AC Section' : '🌬️ Non-AC Section'} · {table.seats} seats
                        </p>
                        {/* Price badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            marginTop: '0.75rem',
                            background: 'rgba(255,255,255,0.18)',
                            borderRadius: '999px',
                            padding: '0.35rem 0.5rem',
                            color: 'white', fontSize: '0.875rem', fontWeight: 700,
                        }}>
                            ₹{price} per session
                        </div>
                    </div>

                    {/* Form body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {field('name', 'Full Name *', <User size={15} />, 'text', 'e.g. Arjun Sharma')}
                        {field('phone', 'Phone Number *', <Phone size={15} />, 'tel', '10-digit mobile number')}
                        {field('email', 'Email (optional)', <Mail size={15} />, 'email', 'your@email.com')}

                        {/* Guest count */}
                        <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>
                                Number of Guests
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {Array.from({ length: table.seats }, (_, i) => i + 1).map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setForm(p => ({ ...p, guests: String(n) }))}
                                        style={{
                                            width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
                                            border: form.guests === String(n) ? 'none' : '1.5px solid rgba(220,88,62,0.2)',
                                            background: form.guests === String(n)
                                                ? 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))'
                                                : 'rgba(255,244,241,0.5)',
                                            color: form.guests === String(n) ? 'white' : 'var(--color-textColor)',
                                            fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >{n}</button>
                                ))}
                            </div>
                        </div>

                        {/* Date */}
                        {field('date', 'Date *', <Calendar size={15} />, 'date')}

                        {/* Time slot */}
                        <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>
                                Time Slot
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setForm(p => ({ ...p, time: slot }))}
                                        style={{
                                            padding: '0.35rem 0.875rem',
                                            borderRadius: '9999px',
                                            border: form.time === slot ? 'none' : '1.5px solid rgba(220,88,62,0.2)',
                                            background: form.time === slot
                                                ? 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))'
                                                : 'white',
                                            color: form.time === slot ? 'white' : 'var(--color-textColor)',
                                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >{slot}</button>
                                ))}
                            </div>
                        </div>

                        {/* Special requests */}
                        <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>
                                Special Requests
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Allergies, anniversary decoration, etc."
                                value={form.specialReq}
                                onChange={e => setForm(p => ({ ...p, specialReq: e.target.value }))}
                                style={{
                                    width: '100%', border: '1.5px solid rgba(220,88,62,0.2)',
                                    borderRadius: '0.75rem', padding: '0.625rem 0.875rem',
                                    fontSize: '0.875rem', resize: 'none', outline: 'none',
                                    background: 'rgba(255,244,241,0.5)', color: 'var(--color-textColor)',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </div>

                        {/* Summary strip */}
                        <div style={{
                            background: 'rgba(220,88,62,0.06)',
                            border: '1px solid rgba(220,88,62,0.18)',
                            borderRadius: '0.875rem',
                            padding: '0.875rem 1rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>
                                <div style={{ fontWeight: 600 }}>Table {table.number} · {table.seats} seats</div>
                                <div>{form.date} at {form.time}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)' }}>Reservation fee</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-solidOne)' }}>₹{price}</div>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{
                                width: '100%', padding: '0.875rem',
                                borderRadius: '9999px', border: 'none', cursor: submitting ? 'wait' : 'pointer',
                                background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                                color: 'white', fontSize: '1rem', fontWeight: 800,
                                boxShadow: '0 4px 18px rgba(220,88,62,0.45)',
                                transition: 'all 0.2s',
                                opacity: submitting ? 0.75 : 1,
                                transform: submitting ? 'scale(0.98)' : 'scale(1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            }}
                        >
                            {submitting ? (
                                <>
                                    <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '9999px', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                                    Processing…
                                </>
                            ) : (
                                <>Confirm Reservation — ₹{price} <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
};

/* ─────────────────────────────────────────────────────────
   SUCCESS SCREEN
───────────────────────────────────────────────────────── */
const SuccessScreen: React.FC<{
    table: Table;
    form: BookingForm;
    onDone: () => void;
}> = ({ table, form, onDone }) => {
    const price = table.section === 'AC' ? AC_PRICE : NON_AC_PRICE;
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
        }}>
            {/* Confetti-like circles */}
            {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: Math.random() * 14 + 6 + 'px',
                    height: Math.random() * 14 + 6 + 'px',
                    borderRadius: '9999px',
                    background: ['#dc583e', '#fd872f', '#22c55e', '#fbbf24', '#3b82f6'][i % 5],
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animation: `confettiFly${i % 3} ${1.2 + Math.random() * 0.8}s ease-out both`,
                    animationDelay: `${i * 0.05}s`,
                }} />
            ))}

            <div style={{
                background: 'white', borderRadius: '2rem',
                width: '100%', maxWidth: '420px',
                textAlign: 'center', padding: '2.5rem 2rem',
                boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
                animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
                position: 'relative', zIndex: 1,
            }}>
                {/* Green check */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 30px rgba(34,197,94,0.4)',
                    animation: 'checkBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
                }}>
                    <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
                </div>

                <h2 style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--color-textColor)', marginBottom: '0.375rem' }}>
                    Booking Confirmed! 🎉
                </h2>
                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                    Your table has been successfully reserved.
                </p>

                {/* Details card */}
                <div style={{
                    background: 'rgba(34,197,94,0.05)',
                    border: '1.5px solid rgba(34,197,94,0.2)',
                    borderRadius: '1.25rem', padding: '1.25rem',
                    textAlign: 'left', marginBottom: '1.5rem',
                }}>
                    {[
                        ['Table', `Table ${table.number} — ${table.section === 'AC' ? '❄️ AC' : '🌬️ Non-AC'}`],
                        ['Guest', form.name],
                        ['Phone', form.phone],
                        ['Guests', form.guests],
                        ['Date & Time', `${form.date} at ${form.time}`],
                        ['Amount', `₹${price}`],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8325rem' }}>
                            <span style={{ color: 'var(--color-gray-500)', fontWeight: 600 }}>{k}</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-textColor)' }}>{v}</span>
                        </div>
                    ))}
                </div>

                {/* Table number highlight */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solidTwo))',
                    color: 'white', borderRadius: '1rem', padding: '1rem',
                    fontWeight: 900, fontSize: '1.75rem', marginBottom: '1.5rem',
                    boxShadow: '0 4px 20px rgba(220,88,62,0.35)',
                    letterSpacing: '0.04em',
                }}>
                    Table #{table.number}
                </div>

                <button
                    onClick={onDone}
                    style={{
                        width: '100%', padding: '0.875rem',
                        borderRadius: '9999px', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid))',
                        color: 'white', fontSize: '1rem', fontWeight: 800,
                        boxShadow: '0 4px 18px rgba(220,88,62,0.4)',
                    }}
                >
                    Done
                </button>
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
   MAIN RESERVATION PAGE
───────────────────────────────────────────────────────── */
const Reservation: React.FC = () => {
    const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
    const [selected, setSelected] = useState<Table | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookedTable, setBookedTable] = useState<Table | null>(null);
    const [bookedForm, setBookedForm] = useState<BookingForm | null>(null);
    const [justBookedId, setJustBookedId] = useState<string | null>(null);
    const [alertMsg, setAlertMsg] = useState<string | null>(null);

    const acTables = tables.filter(t => t.section === 'AC');
    const nonAcTables = tables.filter(t => t.section === 'NON_AC');

    const handleTableClick = (t: Table) => {
        if (t.status === 'booked') {
            setAlertMsg(`Table ${t.number} is already booked by ${t.bookedBy || 'another guest'}.`);
            setTimeout(() => setAlertMsg(null), 3000);
            return;
        }
        if (t.status === 'mine') {
            setAlertMsg(`Table ${t.number} is your reserved table!`);
            setTimeout(() => setAlertMsg(null), 3000);
            return;
        }
        setSelected(t);
    };

    const handleConfirm = (form: BookingForm) => {
        if (!selected) return;
        const updated = tables.map(t =>
            t.id === selected.id ? { ...t, status: 'mine' as TableStatus, bookedBy: form.name } : t
        );
        setTables(updated);
        setBookedTable({ ...selected, status: 'mine', bookedBy: form.name });
        setBookedForm(form);
        setJustBookedId(selected.id);
        setSelected(null);
        setShowSuccess(true);
        setTimeout(() => setJustBookedId(null), 1000);
    };

    const handleDone = () => setShowSuccess(false);

    return (
        <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingTop: '5.5rem' }}>

            {/* Toast alert */}
            {alertMsg && (
                <div style={{
                    position: 'fixed', top: '5.5rem', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 90, background: 'white',
                    borderLeft: '4px solid #ef4444',
                    borderRadius: '0.75rem', padding: '0.75rem 1.25rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    animation: 'fadeInUp 0.3s ease both',
                    fontSize: '0.875rem', fontWeight: 600,
                    whiteSpace: 'nowrap',
                }}>
                    <AlertCircle size={16} color="#ef4444" />
                    {alertMsg}
                </div>
            )}

            {/* ── HERO ── */}
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #1e293b 100%)',
                padding: '3rem 0 5rem', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    {[
                        { s: 320, t: '-100px', r: '-80px', o: 0.06 },
                        { s: 200, b: '-70px', l: '-50px', o: 0.05 },
                    ].map((c: any, i) => (
                        <div key={i} style={{ position: 'absolute', width: c.s, height: c.s, borderRadius: '9999px', background: 'white', opacity: c.o, top: c.t, bottom: c.b, left: c.l, right: c.r }} />
                    ))}
                </div>
                <div className="padd-container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="animate-fadeInUp" style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '0.5rem' }}>
                        Reserve Your Table
                    </h1>
                    <p className="animate-fadeInUp delay-100" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '36rem', lineHeight: 1.6 }}>
                        Choose your perfect spot. Click any available table to begin your reservation, or browse our AC and Non-AC sections.
                    </p>
                    {/* Legend */}
                    <div className="animate-fadeInUp delay-200" style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        {[
                            { color: '#22c55e', label: 'Available' },
                            { color: '#6b7280', label: 'Booked' },
                            { color: '#3b82f6', label: 'Your Reservation' },
                        ].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color }} />
                                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8125rem', fontWeight: 600 }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing strip */}
            <div className="padd-container" style={{ marginTop: '-1px', zIndex: 5, position: 'relative' }}>
                <div style={{
                    display: 'flex', gap: '1rem', flexWrap: 'wrap',
                    background: 'white', borderRadius: '1.25rem',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                    marginTop: '-2.5rem',
                }}>
                    {[
                        { icon: <Wind size={18} color="#3b82f6" />, label: 'AC Section', desc: '8 seats · Premium ambience', price: `₹${AC_PRICE} / session` },
                        { icon: <ThermometerSun size={18} color="#fd872f" />, label: 'Non-AC Section', desc: '4 seats · Open & casual', price: `₹${NON_AC_PRICE} / session` },
                    ].map(row => (
                        <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: '1 1 240px' }}>
                            <div style={{ padding: '0.625rem', background: 'rgba(220,88,62,0.06)', borderRadius: '0.75rem' }}>{row.icon}</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{row.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>{row.desc}</div>
                            </div>
                            <div style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '1rem' }}>
                                {row.price}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── AC SECTION ── */}
            <section className="padd-container" style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.625rem' }}>
                        <Wind size={20} color="#3b82f6" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>AC Section</h2>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-gray-400)' }}>
                            ❄️ Air-conditioned · 8-seat tables · ₹{AC_PRICE} per session
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Info size={13} />
                        {acTables.filter(t => t.status === 'available').length} available
                    </div>
                </div>

                {/* ── AC Floor Plan: Flipped-L shape ─────────────────────────────
                    Top row: T1–T7 across the full width (7 tables)
                    Right column: T8–T12 going down the right side (5 tables)
                ─────────────────────────────────────────────────────────────── */}
                <div style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Room wall decorative border */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '1.5rem',
                        border: '3px solid rgba(59,130,246,0.12)',
                        pointerEvents: 'none',
                    }} />

                    {/* Floor label */}
                    <div style={{
                        position: 'absolute', top: '0.5rem', left: '50%', transform: 'translateX(-50%)',
                        fontSize: '0.65rem', fontWeight: 700, color: 'rgba(59,130,246,0.5)',
                        letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>🚪 Entrance</div>

                    {/* Top row — 7 AC tables */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '0.875rem',
                        marginBottom: '1rem',
                        marginTop: '1.25rem',
                    }}>
                        {acTables.slice(0, 7).map(t => (
                            <TableCard key={t.id} table={t} onClick={handleTableClick} justBooked={t.id === justBookedId} />
                        ))}
                    </div>

                    {/* Right-column + spacer row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '1rem',
                        alignItems: 'start',
                    }}>
                        {/* Centre aisle / walkway */}
                        <div style={{
                            background: 'repeating-linear-gradient(90deg, rgba(59,130,246,0.03) 0px, rgba(59,130,246,0.03) 6px, transparent 6px, transparent 18px)',
                            borderRadius: '1rem',
                            border: '1px dashed rgba(59,130,246,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            minHeight: '320px',
                            fontSize: '0.75rem', fontWeight: 700,
                            color: 'rgba(59,130,246,0.3)',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            flexDirection: 'column', gap: '0.375rem',
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>🛤️</span>
                            Walkway
                        </div>

                        {/* Right column — 5 AC tables stacked vertically */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.875rem',
                            width: '175px',
                        }}>
                            {acTables.slice(7, 12).map(t => (
                                <TableCard key={t.id} table={t} onClick={handleTableClick} justBooked={t.id === justBookedId} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom wall label */}
                    <div style={{
                        textAlign: 'center', marginTop: '0.75rem',
                        fontSize: '0.65rem', fontWeight: 700,
                        color: 'rgba(59,130,246,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>🧱 East Wall</div>
                </div>
            </section>

            {/* ── DIVIDER ── */}
            <div className="padd-container" style={{ marginTop: '2.5rem' }}>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(220,88,62,0.3), transparent)' }} />
                    <span style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'var(--color-primary)',
                        padding: '0 1rem',
                        fontSize: '0.78rem', fontWeight: 700,
                        color: 'var(--color-gray-400)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                    }}>
                        Non-AC Section below
                    </span>
                </div>
            </div>

            {/* ── NON-AC SECTION ── */}
            <section className="padd-container" style={{ marginTop: '2.5rem', paddingBottom: '5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(253,135,47,0.1)', borderRadius: '0.625rem' }}>
                        <ThermometerSun size={20} color="#fd872f" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Non-AC Section</h2>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-gray-400)' }}>
                            🌬️ Open & casual · 4-seat tables · ₹{NON_AC_PRICE} per session
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Info size={13} />
                        {nonAcTables.filter(t => t.status === 'available').length} available
                    </div>
                </div>

                {/* 4 rows × 4 columns */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.1rem',
                }}>
                    {nonAcTables.map(t => (
                        <TableCard key={t.id} table={t} onClick={handleTableClick} justBooked={t.id === justBookedId} />
                    ))}
                </div>
            </section>

            {/* ── MODALS ── */}
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
                    onDone={handleDone}
                />
            )}
        </main>
    );
};

export default Reservation;
