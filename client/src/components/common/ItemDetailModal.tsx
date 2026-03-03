import React, { useEffect } from 'react';
import { X, Star, Flame, ShoppingBasket, LeafIcon } from 'lucide-react';
import type { MenuItem } from '../../types/menu.types';
import { useCart } from '../../context/CartContext';

interface ItemDetailModalProps {
    item: MenuItem;
    onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
    const { addToCart, cartItems } = useCart();

    const categoryName = typeof item.category === 'string'
        ? item.category
        : (item.category as any)?.name ?? '';

    const inCart = cartItems.find(ci => ci.item._id === item._id);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleAdd = () => {
        if (!item.available) return;
        addToCart(item);
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.2s ease both',
            }}
        >
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalPop {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes trendingPulse {
                    0%, 100% { box-shadow: 0 2px 8px rgba(220,88,62,0.5); }
                    50% { box-shadow: 0 4px 18px rgba(220,88,62,0.8), 0 0 0 4px rgba(220,88,62,0.15); }
                }
            `}</style>

            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: '1.75rem',
                    width: '100%',
                    maxWidth: '520px',
                    overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
                    animation: 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
                    position: 'relative',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                        width: '2.25rem', height: '2.25rem', borderRadius: '9999px',
                        background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
                >
                    <X size={16} color="white" />
                </button>

                {/* Image */}
                <div style={{ height: '260px', position: 'relative', overflow: 'hidden' }}>
                    <img
                        src={item.image?.url}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
                    }} />

                    {/* Veg / Non-Veg indicator */}
                    <div style={{
                        position: 'absolute', top: '1rem', left: '1rem',
                        background: 'white', borderRadius: '0.375rem', padding: '0.25rem',
                        width: '1.75rem', height: '1.75rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `2px solid ${item.isVeg ? '#16a34a' : '#dc2626'}`,
                    }}>
                        <div style={{
                            width: '0.75rem', height: '0.75rem', borderRadius: '9999px',
                            background: item.isVeg ? '#16a34a' : '#dc2626',
                        }} />
                    </div>

                    {/* Trending badge */}
                    {item.isTrending && (
                        <div style={{
                            position: 'absolute', top: '1rem', right: '3.5rem',
                            background: 'linear-gradient(135deg, var(--color-solid), var(--color-solidTwo))',
                            color: 'white', fontSize: '0.65rem', fontWeight: 800,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            padding: '0.25rem 0.625rem', borderRadius: '9999px',
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                            animation: 'trendingPulse 2.5s infinite',
                        }}>
                            <Flame size={10} strokeWidth={2.5} />
                            Trending
                        </div>
                    )}

                    {/* Unavailable overlay */}
                    {!item.available && (
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{
                                background: 'rgba(0,0,0,0.8)', color: 'white',
                                padding: '0.5rem 1.5rem', borderRadius: '9999px',
                                fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                            }}>Currently Unavailable</span>
                        </div>
                    )}

                    {/* Price on image */}
                    <div style={{
                        position: 'absolute', bottom: '1rem', left: '1rem',
                        color: 'white', fontWeight: 900, fontSize: '1.75rem',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}>
                        ₹{item.price.toFixed(0)}
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.2 }}>{item.name}</h2>
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.75rem', fontWeight: 700,
                            color: item.isVeg ? '#16a34a' : '#dc2626',
                            background: item.isVeg ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                            padding: '0.25rem 0.75rem', borderRadius: '9999px',
                            whiteSpace: 'nowrap', flexShrink: 0,
                        }}>
                            <LeafIcon size={11} strokeWidth={2.5} />
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {categoryName}
                    </span>

                    <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-gray-500)', lineHeight: 1.6 }}>
                        {item.description}
                    </p>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.875rem' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i} size={14}
                                fill={i < Math.round(item.rating || 4) ? '#fbbf24' : 'none'}
                                stroke={i < Math.round(item.rating || 4) ? '#fbbf24' : '#d1d5db'}
                                strokeWidth={1.5}
                            />
                        ))}
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                            {(item.rating || 4).toFixed(1)} rating
                        </span>
                    </div>

                    {/* Add to cart */}
                    <button
                        onClick={handleAdd}
                        disabled={!item.available}
                        style={{
                            marginTop: '1.5rem', width: '100%', padding: '0.875rem',
                            borderRadius: '9999px', border: 'none',
                            background: !item.available
                                ? 'rgba(107,114,128,0.15)'
                                : inCart
                                    ? 'linear-gradient(135deg, #16a34a, #15803d)'
                                    : 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                            color: item.available ? 'white' : 'var(--color-gray-500)',
                            fontWeight: 800, fontSize: '1rem',
                            cursor: item.available ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            boxShadow: item.available ? '0 4px 18px rgba(220,88,62,0.35)' : 'none',
                            transition: 'all 0.25s ease',
                        }}
                    >
                        <ShoppingBasket size={18} strokeWidth={2.5} />
                        {!item.available ? 'Unavailable' : inCart ? `In Cart (${inCart.quantity})· Add More` : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailModal;
