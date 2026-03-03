import React, { useState } from 'react';
import { ShoppingBasket, Star, Flame, LeafIcon } from 'lucide-react';
import type { MenuItem } from '../../types/menu.types';
import { useIntersection } from '../../hooks/useIntersection';

interface MenuItemCardProps {
    item: MenuItem;
    index?: number; // for stagger delay
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, index = 0 }) => {
    const [hovered, setHovered] = useState(false);
    const [added, setAdded] = useState(false);
    const [ref, visible] = useIntersection<HTMLDivElement>({ threshold: 0.08 });

    const categoryName = typeof item.category === 'string'
        ? item.category
        : (item.category as any)?.name ?? '';

    const staggerDelay = Math.min(index * 60, 300);

    const handleAddToCart = () => {
        if (!item.available) return;
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
                transition: `opacity 0.5s cubic-bezier(0.4,0,0.2,1) ${staggerDelay}ms,
                             transform 0.5s cubic-bezier(0.4,0,0.2,1) ${staggerDelay}ms`,
            }}
        >
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: 'relative',
                    borderRadius: '1.25rem',
                    background: 'white',
                    overflow: 'hidden',
                    boxShadow: hovered
                        ? '0 12px 40px rgba(220,88,62,0.18)'
                        : '0 2px 16px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                    transform: hovered ? 'translateY(-4px)' : 'none',
                    opacity: item.available ? 1 : 0.6,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* ── Image ── */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                        src={item.image?.url}
                        alt={item.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            transform: hovered ? 'scale(1.07)' : 'scale(1)',
                        }}
                    />

                    {/* Dark gradient at bottom of image */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
                    }} />

                    {/* Veg / Non-Veg dot indicator */}
                    <div style={{
                        position: 'absolute',
                        top: '0.625rem',
                        left: '0.625rem',
                        background: 'white',
                        borderRadius: '0.375rem',
                        padding: '0.2rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${item.isVeg ? '#16a34a' : '#dc2626'}`,
                    }}>
                        <div style={{
                            width: '0.625rem',
                            height: '0.625rem',
                            borderRadius: '9999px',
                            background: item.isVeg ? '#16a34a' : '#dc2626',
                        }} />
                    </div>

                    {/* Trending badge */}
                    {item.isTrending && (
                        <div style={{
                            position: 'absolute',
                            top: '0.625rem',
                            right: '0.625rem',
                            background: 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            boxShadow: '0 2px 8px rgba(220,88,62,0.5)',
                            animation: 'trendingPulse 2.5s infinite',
                        }}>
                            <Flame size={9} strokeWidth={2.5} />
                            Trend
                        </div>
                    )}

                    {/* Unavailable overlay */}
                    {!item.available && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.38)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span style={{
                                background: 'rgba(0,0,0,0.75)',
                                color: 'white',
                                padding: '0.35rem 1rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                            }}>Unavailable</span>
                        </div>
                    )}
                </div>

                {/* ── Body ── */}
                <div style={{ padding: '0.875rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {/* Name + Price row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            lineHeight: 1.25,
                            flex: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}>{item.name}</h4>
                        <span style={{
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            color: 'var(--color-solidOne)',
                            whiteSpace: 'nowrap',
                        }}>₹{item.price.toFixed(0)}</span>
                    </div>

                    {/* Category */}
                    <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--color-gray-400)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                    }}>{categoryName}</span>

                    {/* Description */}
                    <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-gray-500)',
                        lineHeight: 1.45,
                        flex: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        margin: '0.125rem 0',
                    }}>{item.description}</p>

                    {/* Rating row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                fill={i < Math.round(item.rating || 4) ? '#fbbf24' : 'none'}
                                stroke={i < Math.round(item.rating || 4) ? '#fbbf24' : '#d1d5db'}
                                strokeWidth={1.5}
                            />
                        ))}
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginLeft: '0.15rem' }}>
                            {(item.rating || 4).toFixed(1)}
                        </span>
                    </div>

                    {/* Footer: veg label + add button */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.5rem',
                        paddingTop: '0.625rem',
                        borderTop: '1px solid rgba(0,0,0,0.05)',
                    }}>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: item.isVeg ? '#16a34a' : '#dc2626',
                            background: item.isVeg ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                        }}>
                            <LeafIcon size={11} strokeWidth={2.5} />
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>

                        <button
                            onClick={handleAddToCart}
                            disabled={!item.available}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.45rem 0.875rem',
                                borderRadius: '9999px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                background: added
                                    ? 'linear-gradient(135deg, #16a34a, #15803d)'
                                    : item.available
                                        ? 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))'
                                        : 'rgba(107,114,128,0.15)',
                                color: item.available ? 'white' : 'var(--color-gray-500)',
                                border: 'none',
                                cursor: item.available ? 'pointer' : 'not-allowed',
                                transition: 'all 0.25s ease',
                                transform: added ? 'scale(0.96)' : 'scale(1)',
                                boxShadow: added || !item.available ? 'none' : '0 2px 8px rgba(220,88,62,0.35)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <ShoppingBasket size={13} strokeWidth={2.5} />
                            {added ? 'Added!' : 'Add'}
                        </button>
                    </div>
                </div>

                {/* Trending pulse animation */}
                <style>{`
                    @keyframes trendingPulse {
                        0%, 100% { box-shadow: 0 2px 8px rgba(220,88,62,0.5); }
                        50% { box-shadow: 0 4px 18px rgba(220,88,62,0.8), 0 0 0 4px rgba(220,88,62,0.15); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default MenuItemCard;
