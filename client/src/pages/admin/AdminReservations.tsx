import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, ChevronDown, User, Mail, Phone, Calendar, Clock, Users } from 'lucide-react';
import api from '../../services/api';

/* ── Types ── */
type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
interface Reservation {
    _id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    tableId: { _id: string; tableNumber: string; capacity: number } | null;
    userId: { _id: string; name: string; email: string } | null;
    date: string;
    time: string;
    guests: number;
    notes?: string;
    status: BookingStatus;
    createdAt: string;
}

const STATUS_OPTIONS: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];

const STATUS_STYLE: Record<BookingStatus, { bg: string; color: string; border: string }> = {
    pending: { bg: 'rgba(234,179,8,0.12)', color: '#b45309', border: 'rgba(234,179,8,0.3)' },
    confirmed: { bg: 'rgba(34,197,94,0.12)', color: '#15803d', border: 'rgba(34,197,94,0.3)' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'rgba(239,68,68,0.25)' },
    completed: { bg: 'rgba(99,102,241,0.12)', color: '#4338ca', border: 'rgba(99,102,241,0.3)' },
};


/* ── Status selector dropdown ── */
const StatusSelect: React.FC<{ current: BookingStatus; onChange: (s: BookingStatus) => void; loading: boolean }> = ({ current, onChange, loading }) => (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <select
            value={current}
            onChange={e => onChange(e.target.value as BookingStatus)}
            disabled={loading}
            style={{ padding: '0.375rem 2rem 0.375rem 0.75rem', borderRadius: '9999px', border: `1.5px solid ${STATUS_STYLE[current].border}`, background: STATUS_STYLE[current].bg, color: STATUS_STYLE[current].color, fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}
        >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ChevronDown size={12} style={{ position: 'absolute', right: '0.5rem', pointerEvents: 'none', color: STATUS_STYLE[current].color }} />
    </div>
);

/* ── Info chip ── */
const Chip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
        <span style={{ color: '#94a3b8' }}>{icon}</span>{label}
    </span>
);

/* ══════════════════════════════════════════════════ */
const AdminReservations: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reservations');
            setReservations(res.data.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const updateStatus = async (id: string, status: BookingStatus) => {
        setUpdatingId(id);
        try {
            await api.patch(`/reservations/${id}/status`, { status });
            setReservations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
        } catch (e) { console.error(e); }
        finally { setUpdatingId(null); }
    };

    const filtered = reservations.filter(r => {
        const matchStatus = !filterStatus || r.status === filterStatus;
        const q = search.toLowerCase();
        const matchSearch = !q || r.customerName.toLowerCase().includes(q) || r.customerEmail.toLowerCase().includes(q) || (r.tableId?.tableNumber ?? '').toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const counts = STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = reservations.filter(r => r.status === s).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:300px; } }
            `}</style>

            {/* Summary chips */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => setFilterStatus(prev => prev === s ? '' : s)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', border: `1.5px solid ${filterStatus === s ? STATUS_STYLE[s].border : 'rgba(0,0,0,0.1)'}`, background: filterStatus === s ? STATUS_STYLE[s].bg : 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: filterStatus === s ? STATUS_STYLE[s].color : '#64748b', transition: 'all 0.18s' }}>
                        <span style={{ fontWeight: 900 }}>{counts[s]}</span> {s}
                    </button>
                ))}
                <button onClick={load} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '9999px', border: '1.5px solid rgba(0,0,0,0.1)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: '#64748b' }}>
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Refresh
                </button>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', borderRadius: '0.875rem', padding: '0.625rem 1rem', border: '1.5px solid rgba(0,0,0,0.08)', maxWidth: '380px' }}>
                <Search size={16} color="#94a3b8" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, table…" style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', flex: 1 }} />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid rgba(249,115,22,0.2)', borderTopColor: '#f97316', borderRadius: '9999px', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <Calendar size={40} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                    <p style={{ fontWeight: 700 }}>No reservations found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map(r => {
                        const tableLabel = r.tableId ? `Table ${r.tableId.tableNumber}` : 'Unknown Table';
                        const isExpanded = expanded === r._id;
                        return (
                            <div key={r._id} style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', border: `1.5px solid ${isExpanded ? STATUS_STYLE[r.status].border : 'transparent'}`, transition: 'border-color 0.2s' }}>
                                {/* Header row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', flexWrap: 'wrap' }} onClick={() => setExpanded(isExpanded ? null : r._id)}>
                                    {/* Avatar */}
                                    <div style={{ width: '38px', height: '38px', borderRadius: '9999px', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                                        {r.customerName[0].toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{r.customerName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{tableLabel} · {r.guests} guest{r.guests !== 1 ? 's' : ''}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{r.date}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{r.time}</div>
                                        </div>
                                        <StatusSelect current={r.status} onChange={s => updateStatus(r._id, s)} loading={updatingId === r._id} />
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', animation: 'slideDown 0.25s ease' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.625rem', marginTop: '1rem' }}>
                                            <Chip icon={<Mail size={13} />} label={r.customerEmail} />
                                            <Chip icon={<Phone size={13} />} label={r.customerPhone} />
                                            <Chip icon={<Users size={13} />} label={`${r.guests} guests`} />
                                            <Chip icon={<Calendar size={13} />} label={r.date} />
                                            <Chip icon={<Clock size={13} />} label={r.time} />
                                            {r.userId && <Chip icon={<User size={13} />} label={`Linked: ${r.userId.name}`} />}
                                        </div>
                                        {r.notes && (
                                            <div style={{ marginTop: '0.75rem', background: 'rgba(0,0,0,0.03)', borderRadius: '0.75rem', padding: '0.75rem', fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>
                                                "{r.notes}"
                                            </div>
                                        )}
                                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {STATUS_OPTIONS.filter(s => s !== r.status).map(s => (
                                                <button key={s} onClick={() => updateStatus(r._id, s)} disabled={updatingId === r._id} style={{ padding: '0.4rem 0.875rem', borderRadius: '9999px', border: `1.5px solid ${STATUS_STYLE[s].border}`, background: STATUS_STYLE[s].bg, color: STATUS_STYLE[s].color, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', opacity: updatingId === r._id ? 0.6 : 1, transition: 'opacity 0.15s' }}>
                                                    → {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminReservations;
