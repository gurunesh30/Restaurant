import React, { useEffect, useState } from 'react';
import {
    Users, UtensilsCrossed, CalendarCheck, TrendingUp,
    Star, Flame,
} from 'lucide-react';
import api from '../../services/api';

/* ── Types ── */
interface Summary {
    totalUsers: number;
    totalReservations: number;
    pendingReservations: number;
    totalMenuItems: number;
    totalCategories: number;
}
interface EarningPoint { id: number; name: string; total: number; }
interface TopItem { _id: string; name: string; price: number; rating: number; isTrending: boolean; }
interface BookingStat { status: string; count: number; }

/* ── Stat card ── */
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string }> = ({ icon, label, value, color, sub }) => (
    <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'transform 0.2s,box-shadow 0.2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '0.875rem', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{sub}</div>}
        </div>
    </div>
);

/* ── Mini bar chart (pure CSS/SVG) ── */
const BarChart: React.FC<{ data: EarningPoint[]; maxVal: number }> = ({ data, maxVal }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '140px', padding: '0 0.5rem' }}>
        {data.map(d => {
            const pct = maxVal > 0 ? (d.total / maxVal) * 100 : 0;
            return (
                <div key={d.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>₹{d.total >= 1000 ? `${(d.total / 1000).toFixed(1)}k` : d.total}</div>
                    <div style={{ width: '100%', height: `${pct}%`, minHeight: '4px', borderRadius: '0.375rem 0.375rem 0 0', background: 'linear-gradient(to top, #f97316, #fb923c)', transition: 'height 0.6s cubic-bezier(0.34,1.56,0.64,1)' }} />
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>{d.name}</div>
                </div>
            );
        })}
    </div>
);

/* ── Status badge ── */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const map: Record<string, { bg: string; color: string }> = {
        pending: { bg: 'rgba(234,179,8,0.12)', color: '#b45309' },
        confirmed: { bg: 'rgba(34,197,94,0.12)', color: '#15803d' },
        cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
        completed: { bg: 'rgba(99,102,241,0.12)', color: '#4338ca' },
    };
    const s = map[status] ?? { bg: '#f1f5f9', color: '#64748b' };
    return (
        <span style={{ background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '9999px', textTransform: 'capitalize' }}>
            {status}
        </span>
    );
};

/* ══════════════════════════════════════════════════ */
const AdminDashboard: React.FC = () => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [earnings, setEarnings] = useState<EarningPoint[]>([]);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [bookings, setBookings] = useState<BookingStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const [s, e, t, b] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/dashboard/earnings'),
                api.get('/admin/dashboard/top-items'),
                api.get('/admin/dashboard/bookings-summary'),
            ]);
            setSummary(s.data.data);
            setEarnings(e.data.data);
            setTopItems(t.data.data);
            setBookings(b.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const toggleTrending = async (id: string) => {
        setTogglingId(id);
        try {
            await api.patch(`/menu/${id}/trending`);
            setTopItems(prev => prev.map(item =>
                item._id === id ? { ...item, isTrending: !item.isTrending } : item
            ));
            // reload top items to reflect any removal
            const res = await api.get('/admin/dashboard/top-items');
            setTopItems(res.data.data);
        } catch (err) { console.error(err); }
        finally { setTogglingId(null); }
    };

    const maxEarning = Math.max(...earnings.map(e => e.total), 1);
    const totalRevenue = earnings.reduce((s, e) => s + e.total, 0);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249,115,22,0.2)', borderTopColor: '#f97316', borderRadius: '9999px', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading dashboard…</p>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
            `}</style>

            {/* ── Stat cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', animation: 'fadeUp 0.3s ease both' }}>
                <StatCard icon={<Users size={20} />} label="Total Users" value={summary?.totalUsers ?? 0} color="#3b82f6" sub="Registered accounts" />
                <StatCard icon={<CalendarCheck size={20} />} label="Total Bookings" value={summary?.totalReservations ?? 0} color="#8b5cf6" sub={`${summary?.pendingReservations ?? 0} pending`} />
                <StatCard icon={<UtensilsCrossed size={20} />} label="Menu Items" value={summary?.totalMenuItems ?? 0} color="#f97316" sub={`${summary?.totalCategories ?? 0} categories`} />
                <StatCard icon={<TrendingUp size={20} />} label="Weekly Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="#10b981" sub="Estimated" />
            </div>

            {/* ── Chart + bookings row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0,340px)', gap: '1.5rem', animation: 'fadeUp 0.35s ease both' }}>
                {/* Bar chart */}
                <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>Weekly Revenue</h3>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>Estimated sales (₹)</p>
                        </div>
                        <span style={{ background: 'rgba(249,115,22,0.1)', color: '#ea580c', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                            ₹{totalRevenue.toLocaleString()} total
                        </span>
                    </div>
                    <BarChart data={earnings} maxVal={maxEarning} />
                </div>

                {/* Bookings by status */}
                <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem' }}>Reservations by Status</h3>
                    {bookings.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No reservation data yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {bookings.map(b => {
                                const total = bookings.reduce((s, x) => s + x.count, 0);
                                const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
                                const colors: Record<string, string> = { pending: '#eab308', confirmed: '#22c55e', cancelled: '#ef4444', completed: '#6366f1' };
                                const c = colors[b.status] ?? '#94a3b8';
                                return (
                                    <div key={b.status}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <StatusBadge status={b.status} />
                                            <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>{b.count} <span style={{ color: '#94a3b8', fontWeight: 500 }}>({pct}%)</span></span>
                                        </div>
                                        <div style={{ height: '6px', borderRadius: '9999px', background: '#f1f5f9', overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: c, transition: 'width 0.8s ease', borderRadius: '9999px' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Trending items ── */}
            <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Flame size={17} color="#f97316" /> Trending Dishes
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Toggle to update trending status</span>
                </div>
                {topItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        <Flame size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                        <p style={{ fontWeight: 600 }}>No trending items yet</p>
                        <p style={{ fontSize: '0.8rem' }}>Mark items as trending in Menu Management.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
                        {topItems.map(item => (
                            <div key={item._id} style={{ border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', transition: 'border-color 0.2s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f97316'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'; }}>
                                <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{item.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Star size={13} color="#f97316" fill="#f97316" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.rating.toFixed(1)}</span>
                                    <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '0.875rem', color: '#0f172a' }}>₹{item.price}</span>
                                </div>
                                <button
                                    disabled={togglingId === item._id}
                                    onClick={() => toggleTrending(item._id)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.5rem', borderRadius: '0.625rem', border: `1.5px solid ${item.isTrending ? 'rgba(249,115,22,0.35)' : 'rgba(0,0,0,0.1)'}`, background: item.isTrending ? 'rgba(249,115,22,0.08)' : 'transparent', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, color: item.isTrending ? '#ea580c' : '#94a3b8', transition: 'all 0.2s', opacity: togglingId === item._id ? 0.6 : 1 }}>
                                    <Flame size={13} />
                                    {togglingId === item._id ? 'Updating…' : item.isTrending ? 'Trending ✓' : 'Set Trending'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`@media(max-width:860px){.dash-chart-row{grid-template-columns:1fr!important;}}`}</style>
        </div>
    );
};

export default AdminDashboard;
