import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, CalendarCheck, ExternalLink,
    LogOut, ChevronLeft, ChevronRight, Menu, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/menu', icon: <UtensilsCrossed size={18} />, label: 'Menu Management' },
    { to: '/admin/reservations', icon: <CalendarCheck size={18} />, label: 'Reservations' },
];

const AdminLayout: React.FC = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Guard: non-admins get sent home
    useEffect(() => {
        if (!isAdmin) navigate('/', { replace: true });
    }, [isAdmin]);

    const handleLogout = () => { logout(); navigate('/'); };

    const SidebarContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Brand */}
            <div style={{ padding: collapsed ? '1.5rem 0.75rem' : '1.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#f97316,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={18} color="white" />
                </div>
                {!collapsed && (
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '1rem', color: 'white', lineHeight: 1 }}>Annapurna</div>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</div>
                    </div>
                )}
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '1rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
                {NAV.map(({ to, icon, label }) => (
                    <NavLink
                        key={to} to={to} onClick={() => setMobileOpen(false)}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center',
                            gap: collapsed ? 0 : '0.75rem',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: '0.75rem',
                            borderRadius: '0.875rem',
                            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                            background: isActive ? 'rgba(249,115,22,0.18)' : 'transparent',
                            color: isActive ? '#fb923c' : 'rgba(255,255,255,0.6)',
                            transition: 'all 0.18s',
                            position: 'relative',
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <span style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: '3px', borderRadius: '9999px', background: '#fb923c' }} />}
                                <span style={{ flexShrink: 0 }}>{icon}</span>
                                {!collapsed && label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom actions */}
            <div style={{ padding: '0.75rem 0.625rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {/* User avatar */}
                {!collapsed && user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.5rem', borderRadius: '0.875rem', marginBottom: '0.25rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '9999px', background: 'linear-gradient(135deg,#f97316,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.875rem', flexShrink: 0 }}>
                            {user.name[0].toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        </div>
                    </div>
                )}

                <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '0.625rem', justifyContent: collapsed ? 'center' : 'flex-start', padding: '0.625rem 0.75rem', borderRadius: '0.875rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.18s', width: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none'; }}>
                    <ExternalLink size={15} />{!collapsed && 'View Site'}
                </button>

                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '0.625rem', justifyContent: collapsed ? 'center' : 'flex-start', padding: '0.625rem 0.75rem', borderRadius: '0.875rem', background: 'none', border: 'none', color: 'rgba(239,68,68,0.7)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.18s', width: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.7)'; e.currentTarget.style.background = 'none'; }}>
                    <LogOut size={15} />{!collapsed && 'Sign Out'}
                </button>
            </div>
        </div>
    );

    const pageTitle = NAV.find(n => location.pathname.startsWith(n.to))?.label ?? 'Admin';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <style>{`
                @keyframes fadeSlide { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:none; } }
                @keyframes spin { to { transform:rotate(360deg); } }
                .admin-sidebar-transition { transition: width 0.25s cubic-bezier(0.4,0,0.2,1); }
            `}</style>

            {/* ── Desktop sidebar ── */}
            <aside className="admin-sidebar-transition" style={{
                width: collapsed ? '68px' : '240px',
                minHeight: '100vh', background: '#0f172a',
                flexDirection: 'column', position: 'relative', flexShrink: 0,
                display: 'none',
            }} id="admin-sidebar-desktop">
                <SidebarContent />
                {/* Collapse toggle */}
                <button onClick={() => setCollapsed(v => !v)} style={{ position: 'absolute', top: '1.25rem', right: '-14px', width: '28px', height: '28px', borderRadius: '9999px', background: '#0f172a', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', zIndex: 10 }}>
                    {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
                </button>
            </aside>

            {/* ── Mobile overlay ── */}
            {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />}
            {/* Mobile drawer */}
            <aside style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px',
                background: '#0f172a', zIndex: 50,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                display: 'none',
            }} id="admin-sidebar-mobile">
                <SidebarContent />
            </aside>

            {/* ── Main area ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top bar */}
                <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(248,250,252,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileOpen(v => !v)} id="admin-mobile-toggle" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                            <Menu size={22} />
                        </button>
                        <h1 style={{ fontWeight: 800, fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{pageTitle}</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'none' }} id="admin-header-email">{user?.email}</span>
                        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '9999px', border: '1.5px solid rgba(0,0,0,0.12)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>
                            <ExternalLink size={13} /> View Site
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '1.75rem', animation: 'fadeSlide 0.3s ease both', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>

            <style>{`
                #admin-sidebar-desktop { display: flex !important; }
                @media (max-width: 768px) {
                    #admin-sidebar-desktop { display: none !important; }
                    #admin-sidebar-mobile { display: flex !important; }
                    #admin-mobile-toggle { display: flex !important; }
                    #admin-header-email { display: block !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
