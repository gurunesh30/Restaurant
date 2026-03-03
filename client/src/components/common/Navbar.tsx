import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBasket, Menu, X } from 'lucide-react';
import ScrollProgress from './ScrollProgress';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { totalCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <header
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    zIndex: 50,
                    padding: '0.75rem 0',
                    backgroundColor: scrolled ? 'rgba(255,244,241,0.96)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    boxShadow: scrolled ? '0 1px 14px rgba(0,0,0,0.08)' : 'none',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
            >
                <div className="padd-container flexBetween">
                    {/* ── Logo ── */}
                    <div style={{ display: 'flex', flex: 1 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <img
                                alt="Annapurna logo"
                                style={{ height: '3rem' }}
                                src="/FoodieFiesta_files/logo-hvC0bAJS.svg"
                            />
                            <div>
                                <span style={{
                                    display: 'block', fontWeight: 800, fontSize: '1.75rem',
                                    position: 'relative', top: '4px', left: '4px', letterSpacing: '-0.02em',
                                }}>Annapurna</span>
                                <span style={{
                                    display: 'block', fontWeight: 800, fontSize: '0.7rem',
                                    position: 'relative', left: '6px', letterSpacing: '9px',
                                    textTransform: 'uppercase', color: 'var(--color-solid)',
                                }}>Junction</span>
                            </div>
                        </Link>
                    </div>

                    {/* ── Desktop Nav ── */}
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                        <nav style={{ display: 'none' }} className="desktop-nav">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/menu', label: 'Menu' },
                                { to: '/reservation', label: 'Reservation' },
                                { to: '/contact', label: 'Contact' },
                            ].map(({ to, label }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={to === '/'}
                                    className={({ isActive }) => isActive ? 'active-link' : ''}
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '9999px',
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: 'var(--color-textColor)',
                                        transition: 'color 0.2s',
                                        position: 'relative',
                                    }}
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* ── Right side actions ── */}
                    <div style={{
                        display: 'flex', flex: 1, alignItems: 'center',
                        justifyContent: 'flex-end', gap: '1rem',
                    }}>
                        {/* Cart button */}
                        <button
                            onClick={() => navigate('/checkout')}
                            style={{
                                position: 'relative', cursor: 'pointer',
                                background: 'white', borderRadius: '9999px',
                                padding: '0.5rem 0.625rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: 'none',
                                minWidth: '2.75rem',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'; }}
                            aria-label="View cart"
                        >
                            <ShoppingBasket size={22} color="var(--color-textColor)" />
                            {totalCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-6px', right: '-6px',
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    background: 'var(--color-solid)',
                                    color: 'white',
                                    borderRadius: '9999px',
                                    minWidth: '1.15rem',
                                    height: '1.15rem',
                                    padding: '0 0.2rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 2px 6px rgba(220,88,62,0.45)',
                                    animation: 'cartBadgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                                }}>
                                    {totalCount > 99 ? '99+' : totalCount}
                                </span>
                            )}
                        </button>

                        {/* Sign In – desktop only */}
                        <Link
                            to="/login"
                            style={{ display: 'none' }}
                            className="desktop-signin"
                        >
                            <div className="btn-solid" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', borderRadius: '9999px' }}>
                                Sign In
                            </div>
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="hamburger-btn"
                            aria-label="Toggle menu"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '2.5rem', height: '2.5rem',
                                background: 'white', borderRadius: '9999px',
                                border: 'none', cursor: 'pointer',
                                transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            }}
                        >
                            <div style={{ transition: 'transform 0.3s', transform: menuOpen ? 'rotate(90deg)' : 'none' }}>
                                {menuOpen ? <X size={20} /> : <Menu size={20} />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* ── Scroll Progress Bar ── */}
                <ScrollProgress />
            </header>

            {/* ── Mobile Overlay ── */}
            <div
                onClick={() => setMenuOpen(false)}
                style={{
                    position: 'fixed', inset: 0, zIndex: 40,
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(2px)',
                    opacity: menuOpen ? 1 : 0,
                    pointerEvents: menuOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* ── Mobile Drawer ── */}
            <div
                style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
                    zIndex: 45,
                    backgroundColor: 'var(--color-primary)',
                    boxShadow: '-4px 0 30px rgba(0,0,0,0.18)',
                    transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
                    padding: '5rem 2rem 2rem',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                }}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '2.5rem', height: '2.5rem',
                        background: 'white', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <X size={20} />
                </button>

                {[
                    { to: '/', label: 'Home' },
                    { to: '/menu', label: 'Menu' },
                    { to: '/reservation', label: 'Reservation' },
                    { to: '/contact', label: 'Contact' },
                ].map(({ to, label }, i) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        onClick={() => setMenuOpen(false)}
                        style={({ isActive }) => ({
                            padding: '0.875rem 1rem', borderRadius: '0.75rem',
                            fontSize: '1rem', fontWeight: 600,
                            color: isActive ? 'var(--color-solid)' : 'var(--color-textColor)',
                            backgroundColor: isActive ? 'rgba(220,88,62,0.08)' : 'transparent',
                            transition: 'all 0.2s', display: 'block',
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? 'translateX(0)' : 'translateX(20px)',
                            transitionDelay: `${i * 50}ms`,
                        })}
                    >
                        {label}
                    </NavLink>
                ))}

                {/* Cart link in mobile drawer */}
                <button
                    onClick={() => { navigate('/checkout'); setMenuOpen(false); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.875rem 1rem', borderRadius: '0.75rem',
                        fontSize: '1rem', fontWeight: 600, border: 'none',
                        background: 'transparent', color: 'var(--color-textColor)',
                        cursor: 'pointer', textAlign: 'left',
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'all 0.25s 0.2s',
                    }}
                >
                    <ShoppingBasket size={18} />
                    Cart {totalCount > 0 && <span style={{ background: 'var(--color-solid)', color: 'white', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, padding: '0 0.4rem' }}>{totalCount}</span>}
                </button>

                <div style={{ marginTop: '1.5rem', opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateX(0)' : 'translateX(20px)', transition: 'all 0.3s 0.25s' }}>
                    <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="btn-solid"
                        style={{ width: '100%', textAlign: 'center', display: 'block', padding: '0.875rem' }}
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes cartBadgePop {
                    from { transform: scale(0); }
                    to   { transform: scale(1); }
                }
                @media (min-width: 1024px) {
                    .desktop-nav { display: flex !important; gap: 0.25rem; }
                    .desktop-signin { display: block !important; }
                    .hamburger-btn { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
