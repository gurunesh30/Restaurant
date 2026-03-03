import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ChevronDown, SlidersHorizontal, Leaf, Drumstick, X } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useMenu } from '../hooks/useMenu';
import type { MenuItem } from '../types/menu.types';
import MenuItemCard from '../components/common/MenuItemCard';

/* ── Random suggestion pool ───────────────────────── */
const SUGGESTIONS = [
    'biryani', 'butter chicken', 'paneer tikka', 'dal makhani',
    'naan', 'samosa', 'vindaloo', 'korma', 'rogan josh', 'palak paneer',
    'chana masala', 'aloo paratha', 'lassi', 'gulab jamun', 'rasmalai',
    'dosa', 'idli', 'pav bhaji', 'chole bhature', 'halwa',
];

/* ── Sort options ─────────────────────────────────── */
const SORT_OPTIONS = [
    { label: 'Default', value: '' },
    { label: 'Price: Low → High', value: 'price_asc' },
    { label: 'Price: High → Low', value: 'price_desc' },
    { label: 'Top Rated', value: 'rating' },
];

/* ── Skeleton card ────────────────────────────────── */
const SkeletonCard: React.FC = () => (
    <div style={{
        borderRadius: '1.25rem',
        background: 'white',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
        <div className="skeleton" style={{ height: '200px', borderRadius: 0 }} />
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
            <div className="skeleton" style={{ height: '0.75rem', width: '40%' }} />
            <div className="skeleton" style={{ height: '0.75rem', width: '90%' }} />
            <div className="skeleton" style={{ height: '0.75rem', width: '80%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <div className="skeleton" style={{ height: '1.75rem', width: '4rem', borderRadius: '9999px' }} />
                <div className="skeleton" style={{ height: '1.75rem', width: '4rem', borderRadius: '9999px' }} />
            </div>
        </div>
    </div>
);

/* ── Sparkle button animation ─────────────────────── */
const SparkleCSS = () => (
    <style>{`
        @keyframes sparkleFloat {
            0%   { transform: scale(0) rotate(0deg);   opacity: 1; }
            100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
        }
        @keyframes sparkleGlow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(253,135,47,0.4); }
            50%       { box-shadow: 0 0 0 10px rgba(253,135,47,0); }
        }
        @keyframes spinSpark {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }
        .sparkle-btn {
            position: relative;
            background: linear-gradient(135deg, #fd872f, #dc583e);
            color: white;
            border: none;
            border-radius: 9999px;
            padding: 0.55rem 1.25rem;
            font-size: 0.8125rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            animation: sparkleGlow 2.2s ease-in-out infinite;
            transition: transform 0.2s, filter 0.2s;
            white-space: nowrap;
            overflow: visible;
        }
        .sparkle-btn:hover { transform: scale(1.06); filter: brightness(1.1); }
        .sparkle-btn:active { transform: scale(0.96); }
        .sparkle-btn .spin-icon { animation: spinSpark 2s linear infinite; }
        .sparkle-btn::before, .sparkle-btn::after {
            content: '✦';
            position: absolute;
            font-size: 0.55rem;
            color: #fde68a;
            animation: sparkleFloat 1.6s ease-out infinite;
            pointer-events: none;
        }
        .sparkle-btn::before { top: -6px; left: 10px; animation-delay: 0s; }
        .sparkle-btn::after  { bottom: -6px; right: 10px; animation-delay: 0.8s; }

        .menu-filter-chip {
            padding: 0.45rem 1rem;
            border-radius: 9999px;
            border: 1.5px solid rgba(220,88,62,0.2);
            background: white;
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--color-textColor);
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 0.35rem;
        }
        .menu-filter-chip:hover { border-color: var(--color-solid); color: var(--color-solid); }
        .menu-filter-chip.active {
            background: var(--color-solid);
            border-color: var(--color-solid);
            color: white;
        }

        .cat-chip {
            padding: 0.45rem 1.1rem;
            border-radius: 9999px;
            border: 1.5px solid rgba(220,88,62,0.18);
            background: white;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.22s ease;
            white-space: nowrap;
            color: var(--color-textColor);
        }
        .cat-chip:hover { border-color: var(--color-solid); color: var(--color-solid); transform: translateY(-1px); }
        .cat-chip.active {
            background: var(--color-solid);
            border-color: var(--color-solid);
            color: white;
            box-shadow: 0 4px 14px rgba(220,88,62,0.35);
        }

        /* input focus ring */
        .menu-search-input:focus { outline: none; }
        .menu-search-wrap:focus-within { border-color: var(--color-solid) !important; box-shadow: 0 0 0 3px rgba(220,88,62,0.12) !important; }

        @keyframes paginationPop {
            0% { transform: scale(0.85); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }

        /* dropdown */
        .sort-dropdown {
            position: relative;
        }
        .sort-dropdown-menu {
            position: absolute;
            top: calc(100% + 6px);
            right: 0;
            background: white;
            border: 1px solid rgba(220,88,62,0.15);
            border-radius: 0.875rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            min-width: 180px;
            z-index: 20;
            overflow: hidden;
            animation: paginationPop 0.2s ease both;
        }
        .sort-option {
            padding: 0.65rem 1rem;
            font-size: 0.8125rem;
            cursor: pointer;
            transition: background 0.15s;
            font-weight: 500;
            color: var(--color-textColor);
        }
        .sort-option:hover { background: rgba(220,88,62,0.07); }
        .sort-option.selected { color: var(--color-solid); font-weight: 700; }
    `}</style>
);

/* ═══════════════════════════════════════════════════
   MENU PAGE
═══════════════════════════════════════════════════ */
const Menu: React.FC = () => {
    /* ── State ── */
    const [searchTerm, setSearchTerm] = useState('');
    const [liveSearch, setLiveSearch] = useState(''); // debounced
    const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('');
    const [isSparkled, setIsSparkled] = useState(false);

    const sortRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    /* ── Data hooks ── */
    const { categories, loading: catsLoading } = useCategories();
    const {
        items, loading: menuLoading, error: menuError,
        filters, updateFilters, total, page, pages,
    } = useMenu({ available: undefined, limit: 12 });

    /* ── Debounced search ── */
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setLiveSearch(searchTerm);
        }, 420);
        return () => clearTimeout(debounceRef.current);
    }, [searchTerm]);

    useEffect(() => {
        updateFilters({ search: liveSearch || undefined, page: 1 });
    }, [liveSearch]);

    /* ── Veg filter ── */
    useEffect(() => {
        updateFilters({
            isVeg: vegFilter === 'veg' ? true : vegFilter === 'nonveg' ? false : undefined,
            page: 1,
        });
    }, [vegFilter]);

    /* ── Sort ── */
    useEffect(() => {
        updateFilters({ sort: (selectedSort as any) || undefined, page: 1 });
    }, [selectedSort]);

    /* ── Close sort dropdown on outside click ── */
    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    /* ── Random suggestion ── */
    const handleSuggest = () => {
        const random = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
        setIsSparkled(true);
        setSearchTerm(random);
        setTimeout(() => setIsSparkled(false), 600);
    };

    /* ── Helpers ── */
    const clearSearch = () => { setSearchTerm(''); };

    const handleCategoryChange = (categoryId?: string) => {
        updateFilters({ categoryId, page: 1 });
    };

    const handlePage = (p: number) => {
        updateFilters({ page: p });
        window.scrollTo({ top: 290, behavior: 'smooth' });
    };

    const selectedSortLabel = SORT_OPTIONS.find(o => o.value === selectedSort)?.label ?? 'Sort';

    /* ── Render ── */
    return (
        <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingTop: '5.5rem' }}>
            <SparkleCSS />

            {/* ══ HERO HEADER ══════════════════════════════ */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-solidOne) 0%, var(--color-solid) 55%, var(--color-solidTwo) 100%)',
                padding: '3rem 0 5rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                {[
                    { size: 280, top: '-80px', right: '-60px', opacity: 0.08 },
                    { size: 180, bottom: '-60px', left: '-40px', opacity: 0.07 },
                    { size: 120, top: '20px', left: '30%', opacity: 0.06 },
                ].map((c, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: c.size, height: c.size,
                        borderRadius: '9999px',
                        background: 'white',
                        opacity: c.opacity,
                        top: (c as any).top, bottom: (c as any).bottom,
                        left: (c as any).left, right: (c as any).right,
                    }} />
                ))}

                <div className="padd-container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="animate-fadeInUp" style={{
                        color: 'white',
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 900,
                        lineHeight: 1.05,
                        marginBottom: '0.5rem',
                    }}>
                        Our Menu
                    </h1>
                    <p className="animate-fadeInUp delay-100" style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1rem', maxWidth: '32rem' }}>
                        Explore dishes crafted with love — from timeless classics to bold new favourites.
                        {total > 0 && (
                            <span style={{ display: 'block', marginTop: '0.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>
                                {total} mouth-watering dishes await!
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* ══ SEARCH + FILTER PANEL (floats over hero) ══ */}
            <div className="padd-container" style={{ position: 'relative', zIndex: 5, marginTop: '-2.5rem' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                }}>
                    {/* Row 1: Search bar */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Search input */}
                        <div
                            className="menu-search-wrap"
                            style={{
                                flex: '1 1 260px',
                                display: 'flex',
                                alignItems: 'center',
                                border: '1.5px solid rgba(220,88,62,0.2)',
                                borderRadius: '9999px',
                                padding: '0 1rem',
                                height: '48px',
                                background: 'rgba(255,244,241,0.6)',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                            }}
                        >
                            <Search size={18} color="var(--color-gray-400)" strokeWidth={2} />
                            <input
                                className="menu-search-input"
                                type="text"
                                placeholder="Search dishes, ingredients…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-textColor)',
                                }}
                            />
                            {searchTerm && (
                                <button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                                    <X size={16} color="var(--color-gray-400)" />
                                </button>
                            )}
                        </div>

                        {/* Sparkle suggestion button */}
                        <button
                            className="sparkle-btn"
                            onClick={handleSuggest}
                            title="Suggest a random dish!"
                            style={{ transform: isSparkled ? 'scale(0.93) rotate(-3deg)' : undefined }}
                        >
                            <Sparkles size={14} className="spin-icon" strokeWidth={2.5} />
                            Surprise me!
                        </button>

                        {/* Sort dropdown */}
                        <div className="sort-dropdown" ref={sortRef}>
                            <button
                                className="menu-filter-chip"
                                onClick={() => setSortOpen(v => !v)}
                                style={{ minWidth: '120px', justifyContent: 'space-between' }}
                            >
                                <SlidersHorizontal size={13} strokeWidth={2.5} />
                                {selectedSortLabel}
                                <ChevronDown size={13} style={{ transition: 'transform 0.25s', transform: sortOpen ? 'rotate(180deg)' : 'none' }} />
                            </button>
                            {sortOpen && (
                                <div className="sort-dropdown-menu">
                                    {SORT_OPTIONS.map(opt => (
                                        <div
                                            key={opt.value}
                                            className={`sort-option ${selectedSort === opt.value ? 'selected' : ''}`}
                                            onClick={() => { setSelectedSort(opt.value); setSortOpen(false); }}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Veg / Non-Veg pills */}
                    <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gray-500)', marginRight: '0.25rem' }}>Filter:</span>
                        {[
                            { label: 'All', value: 'all', icon: null },
                            { label: 'Veg', value: 'veg', icon: <Leaf size={12} strokeWidth={2.5} /> },
                            { label: 'Non-Veg', value: 'nonveg', icon: <Drumstick size={12} strokeWidth={2.5} /> },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                className={`menu-filter-chip ${vegFilter === opt.value ? 'active' : ''}`}
                                onClick={() => setVegFilter(opt.value as any)}
                            >
                                {opt.icon}
                                {opt.label}
                            </button>
                        ))}

                        {/* Active search tag */}
                        {liveSearch && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                background: 'rgba(220,88,62,0.08)',
                                border: '1px solid rgba(220,88,62,0.2)',
                                borderRadius: '9999px',
                                padding: '0.3rem 0.75rem',
                                fontSize: '0.78rem', fontWeight: 600,
                                color: 'var(--color-solid)',
                            }}>
                                <Search size={11} />
                                "{liveSearch}"
                                <button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 1 }}>
                                    <X size={12} color="var(--color-solid)" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ CATEGORIES ═════════════════════════════ */}
            <div className="padd-container" style={{ marginTop: '2rem' }}>
                {catsLoading ? (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: '36px', minWidth: '90px', borderRadius: '9999px', flexShrink: 0 }} />
                        ))}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'nowrap', paddingBottom: '2px' }}>
                            <button
                                className={`cat-chip ${!filters.categoryId ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(undefined)}
                            >
                                🍽️ All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    className={`cat-chip ${filters.categoryId === cat._id ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(cat._id)}
                                >
                                    {cat.name}
                                    {cat.itemCount !== undefined && (
                                        <span style={{ marginLeft: '0.3rem', opacity: 0.7, fontSize: '0.7rem' }}>({cat.itemCount})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ══ RESULTS LABEL ═══════════════════════════ */}
            <div className="padd-container" style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', fontWeight: 500 }}>
                    {menuLoading ? (
                        <div className="skeleton" style={{ height: '1rem', width: '140px' }} />
                    ) : (
                        <>
                            Showing <strong style={{ color: 'var(--color-textColor)' }}>{items.length}</strong> of{' '}
                            <strong style={{ color: 'var(--color-textColor)' }}>{total}</strong> dishes
                            {liveSearch && <> for <em>"{liveSearch}"</em></>}
                        </>
                    )}
                </div>
            </div>

            {/* ══ GRID ════════════════════════════════════ */}
            <div className="padd-container" style={{ marginTop: '1.25rem', paddingBottom: '4rem' }}>

                {/* Error */}
                {menuError && !menuLoading && (
                    <div style={{
                        textAlign: 'center', padding: '3rem', borderRadius: '1.25rem',
                        background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Couldn't load menu</h3>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>{menuError}</p>
                    </div>
                )}

                {/* Empty state */}
                {!menuLoading && !menuError && items.length === 0 && (
                    <div style={{
                        textAlign: 'center', padding: '4rem 2rem', borderRadius: '1.5rem',
                        background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🍽️</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No dishes found</h3>
                        <p style={{ color: 'var(--color-gray-500)', maxWidth: '28rem', margin: '0 auto 1.5rem' }}>
                            Try adjusting your search or filters — our kitchen has plenty of surprises!
                        </p>
                        <button className="btn-solid" style={{ borderRadius: '9999px', padding: '0.6rem 1.5rem' }}
                            onClick={() => { setSearchTerm(''); setVegFilter('all'); handleCategoryChange(undefined); }}>
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Loading skeletons */}
                {menuLoading && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Cards */}
                {!menuLoading && !menuError && items.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {items.map((item: MenuItem, i: number) => (
                            <MenuItemCard key={item._id} item={item} index={i} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {!menuLoading && pages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '3rem',
                        flexWrap: 'wrap',
                    }}>
                        <button
                            onClick={() => handlePage(page - 1)}
                            disabled={page <= 1}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '9999px',
                                border: '1.5px solid var(--color-gray-300)',
                                background: 'white',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                                opacity: page <= 1 ? 0.4 : 1,
                                transition: 'all 0.2s',
                            }}
                        >← Prev</button>

                        {Array.from({ length: pages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2)
                            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, i) => (
                                p === '...'
                                    ? <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: 'var(--color-gray-400)' }}>…</span>
                                    : <button
                                        key={p}
                                        onClick={() => handlePage(p as number)}
                                        style={{
                                            width: '2.25rem',
                                            height: '2.25rem',
                                            borderRadius: '9999px',
                                            border: page === p ? 'none' : '1.5px solid var(--color-gray-300)',
                                            background: page === p ? 'var(--color-solid)' : 'white',
                                            color: page === p ? 'white' : 'var(--color-textColor)',
                                            fontSize: '0.8125rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: page === p ? '0 4px 14px rgba(220,88,62,0.35)' : 'none',
                                        }}
                                    >{p}</button>
                            ))}

                        <button
                            onClick={() => handlePage(page + 1)}
                            disabled={page >= pages}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '9999px',
                                border: '1.5px solid var(--color-gray-300)',
                                background: 'white',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: page >= pages ? 'not-allowed' : 'pointer',
                                opacity: page >= pages ? 0.4 : 1,
                                transition: 'all 0.2s',
                            }}
                        >Next →</button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Menu;
