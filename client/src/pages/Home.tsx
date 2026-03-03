import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Truck, ShieldCheck, PhoneCall, ShoppingBasket } from 'lucide-react';
import type { MenuItem } from '../types/menu.types';

/* ────────────────────────────────────────────────────────
   STATIC DATA
──────────────────────────────────────────────────────── */

// Trending slider images from Unsplash (curated food photography)
const TRENDING_SLIDES = [
    {
        id: 't1',
        title: 'Paneer Tikka',
        category: 'Starter',
        description: 'Smoky, marinated cottage cheese cubes grilled to perfection with colourful peppers.',
        price: '₹8.99',
        img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&auto=format&fit=crop&q=80',
    },
    {
        id: 't2',
        title: 'Butter Chicken',
        category: 'Main Course',
        description: 'Tender chicken in a rich, velvety tomato butter gravy – India\'s most loved comfort food.',
        price: '₹12.99',
        img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&auto=format&fit=crop&q=80',
    },
    {
        id: 't3',
        title: 'Chicken Biryani',
        category: 'Rice',
        description: 'Fragrant basmati rice layered with spiced chicken, saffron and caramelised onions.',
        price: '₹13.99',
        img: 'data:image/jpeg;base64,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',
    },
];

// Top picks – using FoodieFiesta local images
const TOP_PICKS = [
    { id: 'p1', name: 'Spicy Chicken Curry', category: 'Curry', price: '₹5', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/irybfxylxyzewlryw0mb.png' },
    { id: 'p2', name: 'Vegetarian Chickpea Curry', category: 'Curry', price: '₹10', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/how0qap1dqgvmdlysauf.png' },
    { id: 'p3', name: 'Beef Vindaloo', category: 'Curry', price: '₹20', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/dvdomz3dkmjsewhd7vou.png' },
    { id: 'p4', name: 'Creamy Paneer Butter Masala', category: 'Curry', price: '₹15', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/evfpl4jb3htslwckcl1j.png' },
    { id: 'p5', name: 'Lamb Rogan Josh', category: 'Curry', price: '₹5', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/t1eoiuckvrdpm6uens4j.png' },
    { id: 'p6', name: 'Fish Curry with Coconut Milk', category: 'Curry', price: '₹10', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/gijv1fssvbzlr6i2jbxr.png' },
    { id: 'p7', name: 'Margherita Pizza', category: 'Pizza', price: '₹30', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/tyjkkebvoss3iifvu2wz.png' },
    { id: 'p8', name: 'Pepperoni Pizza', category: 'Pizza', price: '₹30', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/am8qmn8v4pi7je8xtt8n.png' },
    { id: 'p9', name: 'Egg Curry with Spices', category: 'Curry', price: '₹5', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/zjtlmxrwsddbmgtaw9db.png' },
    { id: 'p10', name: 'Vegetable Fried Rice', category: 'Rice', price: '₹15', rating: 5.0, prep: '5m', cook: '20m', img: '/FoodieFiesta_files/sntfcr0ofh7r1n9tnxrm.png' },
];

// User reviews
const REVIEWS = [
    {
        id: 'r1',
        name: 'Gazi jarin',
        role: 'Content Creator',
        img: 'https://www.gazijarin.com/assets/me2.jpg',
        bg: '#edbdcd',
        review: "FoodieFiesta completely changed how I order food. The variety is incredible and every dish I've tried has been restaurant-quality. The butter chicken is absolutely divine — rich, creamy and perfectly spiced every single time!",
    },
    {
        id: 'r2',
        name: 'Ada lovelace',
        role: 'Digital Content Creator',
        img: '/FoodieFiesta_files/user1-Dd5F7AoR.png',
        bg: '#aed6ff',
        review: "I've been ordering through FoodieFiesta for over a year and it never disappoints. Delivery is always lightning-fast, portions are generous and the packaging keeps everything perfectly fresh. The biryani is my absolute go-to!",
    },
];

/* ────────────────────────────────────────────────────────
   STAR RATING COMPONENT
──────────────────────────────────────────────────────── */
const StarRating: React.FC<{ rating?: number; size?: number; color?: string }> = ({ rating = 5, size = 16, color = '#fdc700' }) => {
    const full = Math.floor(rating);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            {Array.from({ length: full }).map((_, i) => (
                <Star key={i} size={size} fill={color} stroke={color} />
            ))}
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   PRODUCT CARD (Top Picks / Trending cards)
──────────────────────────────────────────────────────── */
interface ProductCardProps {
    name: string;
    category: string;
    price: string;
    rating: number;
    prep: string;
    cook: string;
    img: string;
    description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, category, price, rating, prep, cook, img, description }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{ position: 'relative', marginTop: '6rem' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Circular img */}
            <div style={{
                position: 'absolute',
                left: 0, right: 0,
                top: '-5.25rem',
                height: '177px',
                width: '177px',
                margin: '0 auto',
                borderRadius: '9999px',
            }}>
                <img
                    src={img}
                    alt={name}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '9999px',
                        transition: 'opacity 0.3s, transform 0.3s',
                        opacity: hovered ? 0.85 : 1,
                        transform: hovered ? 'scale(1.06)' : 'scale(1)',
                        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
                    }}
                />
            </div>

            {/* Card body */}
            <div style={{
                borderRadius: '2rem',
                background: 'var(--color-primary)',
                paddingTop: '5rem',
                overflow: 'hidden',
                boxShadow: hovered ? '0 8px 30px rgba(220,88,62,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.3s ease',
                border: '1px solid rgba(220,88,62,0.08)',
            }}>
                <div style={{ padding: '0.75rem' }}>
                    <h4 style={{
                        fontSize: '1.125rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        marginBottom: '0.25rem',
                    }}>{name}</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                        <h5 style={{ marginBottom: '0.25rem' }}>{category}</h5>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <StarRating rating={rating} size={14} />
                            <h5>{rating.toFixed(1)}</h5>
                        </div>
                    </div>
                    {description && (
                        <p style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>
                            {description}
                        </p>
                    )}
                </div>

                {/* Price row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.75rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-light" style={{ borderRadius: '0.25rem', height: '1.5rem', width: '1.5rem', padding: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>H</button>
                        <button className="btn-outline" style={{ borderRadius: '0.25rem', height: '1.5rem', width: '1.5rem', padding: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>F</button>
                    </div>
                    <h4 style={{ color: 'var(--color-solidOne)' }}>{price}</h4>
                </div>

                {/* Footer row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0.75rem', paddingLeft: '1.25rem', fontSize: '13px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative', bottom: '0.375rem' }}>
                            <h5>Prep</h5>
                            <p style={{ fontSize: '0.75rem' }}>{prep}</p>
                        </div>
                        <div style={{ height: '2rem', width: '1px', background: 'rgba(217,89,66,0.1)', border: 'none' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative', bottom: '0.375rem' }}>
                            <h5>Cook</h5>
                            <p style={{ fontSize: '0.75rem' }}>{cook}</p>
                        </div>
                    </div>
                    <div>
                        <button className="btn-solid" style={{ borderRadius: '0.25rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBasket size={18} color="white" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   MENU ITEM CARD (DB items)
──────────────────────────────────────────────────────── */
const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{ position: 'relative', marginTop: '6rem' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                position: 'absolute',
                left: 0, right: 0,
                top: '-5.25rem',
                height: '177px',
                width: '177px',
                margin: '0 auto',
                borderRadius: '9999px',
            }}>
                <img
                    src={item.image?.url}
                    alt={item.name}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '9999px',
                        transition: 'transform 0.3s',
                        transform: hovered ? 'scale(1.06)' : 'scale(1)',
                        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
                    }}
                />
            </div>
            <div style={{
                borderRadius: '2rem',
                background: 'var(--color-primary)',
                paddingTop: '5rem',
                overflow: 'hidden',
                boxShadow: hovered ? '0 8px 30px rgba(220,88,62,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.3s ease',
                border: '1px solid rgba(220,88,62,0.08)',
            }}>
                <div style={{ padding: '0.75rem' }}>
                    <h4 style={{ fontSize: '1.125rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', marginBottom: '0.25rem' }}>{item.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                        <h5 style={{ marginBottom: '0.25rem' }}>{typeof item.category === 'string' ? item.category : (item.category as any)?.name}</h5>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <StarRating rating={item.rating || 5} size={14} />
                            <h5>{(item.rating || 5).toFixed(1)}</h5>
                        </div>
                    </div>
                    <p style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>{item.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.75rem 0.5rem' }}>
                    <span style={{
                        background: item.isVeg ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: item.isVeg ? 'var(--color-green-500)' : 'var(--color-red-500)',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                    }}>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                    <h4 style={{ color: 'var(--color-solidOne)' }}>₹{item.price.toFixed(2)}</h4>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0.75rem 0.75rem' }}>
                    <button className="btn-solid" style={{ borderRadius: '0.25rem', padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   HOME PAGE
──────────────────────────────────────────────────────── */
const Home: React.FC = () => {
    const [trendingItems, setTrendingItems] = useState<MenuItem[]>([]);
    const [_loading, setLoading] = useState(true);

    // Hero slider state (trending section header)
    const [heroIdx, setHeroIdx] = useState(0);
    const heroIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Top-picks slider
    const [picksPage, setPicksPage] = useState(0);
    const picksPerPage = 5;
    const totalPicksPages = Math.ceil(TOP_PICKS.length / picksPerPage);

    const startHeroInterval = () => {
        if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
        heroIntervalRef.current = setInterval(() => {
            setHeroIdx(prev => (prev + 1) % TRENDING_SLIDES.length);
        }, 5000);
    };

    useEffect(() => {
        startHeroInterval();
        return () => { if (heroIntervalRef.current) clearInterval(heroIntervalRef.current); };
    }, []);

    const goToHero = (idx: number) => {
        setHeroIdx(idx);
        startHeroInterval();
    };
    const prevHero = () => goToHero((heroIdx - 1 + TRENDING_SLIDES.length) % TRENDING_SLIDES.length);
    const nextHero = () => goToHero((heroIdx + 1) % TRENDING_SLIDES.length);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { getTrendingItems } = await import('../services/menuService');
                const response = await getTrendingItems();
                if (response.success) setTrendingItems(response.data.slice(0, 5));
            } catch { /* silent */ } finally { setLoading(false); }
        };
        fetch();
    }, []);

    const visiblePicks = TOP_PICKS.slice(picksPage * picksPerPage, (picksPage + 1) * picksPerPage);

    return (
        <main style={{ overflowX: 'hidden', color: 'var(--color-textColor)' }}>

            {/* ════════════════════════════════
                HERO / INTRODUCTION SECTION
            ════════════════════════════════ */}
            <section style={{ position: 'relative', minHeight: '100vh' }}>
                {/* Background image (right side hero) – only on md+ */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    overflow: 'hidden',
                }}>
                    <img
                        src="/Screenshot 2026-03-03 213214.png"
                        alt="Hero food background"
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            height: '100%',
                            width: '55%',
                            objectFit: 'cover',
                            objectPosition: 'left center',
                        }}
                        className="hero-bg-img"
                    />
                    {/* Gradient overlay so text stays readable */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, var(--color-primary) 45%, rgba(255,244,241,0.6) 65%, rgba(255,244,241,0) 100%)',
                    }} className="hero-overlay" />
                </div>

                <div className="padd-container" style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    paddingTop: '6rem',
                    paddingBottom: '4rem',
                }}>
                    {/* Text content */}
                    <div style={{ maxWidth: '50rem' }}>
                        <h3 style={{ color: 'var(--color-textColor)' }}>Fresh Bites for Every Mood</h3>
                        <h2 style={{ textTransform: 'uppercase', marginBottom: 0, letterSpacing: '0.22rem' }}>
                            <span style={{ color: 'var(--color-solidOne)' }}>Get More </span>
                            <span style={{ color: 'var(--color-solidTwo)' }}>for Less – 25% Off!</span>
                        </h2>
                        <h1 style={{ fontWeight: 800, lineHeight: 1 }}>on Rice &amp; Curries</h1>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                            <h3>Starting From</h3>
                            <span style={{
                                background: 'white',
                                padding: '0.25rem',
                                display: 'inline-block',
                                transform: 'rotate(-2deg)',
                                marginLeft: '0.625rem',
                                fontSize: '3rem',
                                fontWeight: 800,
                            }}>
                                <span style={{ fontSize: '1.5rem', position: 'relative', bottom: '0.75rem' }}></span>400rs
                                <span style={{ fontSize: '1.5rem' }}></span>
                            </span>
                        </div>
                        <Link to="/menu">
                            <button className="btn-solid" style={{ borderRadius: 0, padding: '1.25rem', width: '13rem', fontSize: '1.125rem', fontWeight: 700, marginTop: '2rem' }}>
                                Shop Now
                            </button>
                        </Link>
                    </div>

                    {/* User review badge (bottom-left of hero) */}
                    <div style={{ marginTop: '2.25rem', paddingBottom: '2.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {/* User avatars */}
                            <div style={{ display: 'flex' }}>
                                {['/FoodieFiesta_files/user1-Dd5F7AoR.png', 'https://www.gazijarin.com/assets/me2.jpg'].map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt="user"
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '9999px',
                                            border: '2px solid white',
                                            marginLeft: i === 0 ? 0 : '-0.75rem',
                                            zIndex: 2 - i,
                                            transition: 'transform 0.2s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = '')}
                                    />
                                ))}
                            </div>
                            <div style={{
                                paddingLeft: '0.75rem',
                                borderLeft: '1px solid var(--color-gray-300)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                    <StarRating rating={5} size={18} />
                                    <p style={{ color: 'var(--color-gray-600)', fontWeight: 500, marginLeft: '0.5rem' }}>4.7</p>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                                    Enjoyed by <span style={{ fontWeight: 500, color: 'var(--color-gray-800)' }}>100,000+</span> customers
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @media (max-width: 767px) {
                        .hero-bg-img { width: 100% !important; opacity: 0.25; }
                        .hero-overlay { background: linear-gradient(to bottom, rgba(255,244,241,0.6) 0%, rgba(255,244,241,0.95) 60%) !important; }
                    }
                `}</style>
            </section>

            {/* ════════════════════════════════
                TRENDING SLIDER SECTION
            ════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: 'white' }}>
                <div className="padd-container">
                    {/* Section header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ textTransform: 'uppercase' }}>
                            Trending<span style={{ fontWeight: 300, color: 'var(--color-solidTwo)' }}> Now</span>
                        </h3>
                        <p style={{ maxWidth: '32rem', margin: '0.5rem auto 0', textAlign: 'center' }}>
                            Discover fresh foods that delight your taste, nourish your body, and bring joy to every meal.
                        </p>
                    </div>

                    {/* Big image slider */}
                    <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
                        {/* Slide */}
                        {TRENDING_SLIDES.map((slide, i) => (
                            <div
                                key={slide.id}
                                style={{
                                    display: i === heroIdx ? 'flex' : 'none',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* Image */}
                                <div style={{ position: 'relative', height: '460px', overflow: 'hidden' }}>
                                    <img
                                        src={slide.img}
                                        alt={slide.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                    {/* Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                                    }} />
                                    {/* Text over image */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '2rem',
                                        left: '2rem',
                                        color: 'white',
                                    }}>
                                        <span style={{
                                            background: 'var(--color-solid)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}>{slide.category}</span>
                                        <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '2rem' }}>{slide.title}</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '30rem', marginTop: '0.25rem' }}>{slide.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{slide.price}</span>
                                            <Link to="/menu">
                                                <button className="btn-solid" style={{ borderRadius: '9999px', padding: '0.5rem 1.5rem' }}>Order Now</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Prev / Next buttons */}
                        <button onClick={prevHero} style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '9999px',
                            width: '2.75rem',
                            height: '2.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 5,
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'white')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
                        >
                            <ChevronLeft size={20} color="var(--color-textColor)" />
                        </button>
                        <button onClick={nextHero} style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '9999px',
                            width: '2.75rem',
                            height: '2.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 5,
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'white')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
                        >
                            <ChevronRight size={20} color="var(--color-textColor)" />
                        </button>

                        {/* Dots */}
                        <div style={{
                            position: 'absolute',
                            bottom: '1.25rem',
                            right: '1.5rem',
                            display: 'flex',
                            gap: '0.5rem',
                            zIndex: 5,
                        }}>
                            {TRENDING_SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToHero(i)}
                                    style={{
                                        width: i === heroIdx ? '1.5rem' : '0.5rem',
                                        height: '0.5rem',
                                        borderRadius: '9999px',
                                        background: i === heroIdx ? 'white' : 'rgba(255,255,255,0.5)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Trending item cards below slider */}
                    <div style={{
                        marginTop: '7rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {TRENDING_SLIDES.map(slide => (
                            <ProductCard
                                key={slide.id}
                                name={slide.title}
                                category={slide.category}
                                price={slide.price}
                                rating={4.7}
                                prep="5m"
                                cook="15m"
                                img={slide.img}
                                description={slide.description}
                            />
                        ))}
                        {/* Also show DB trending items if available */}
                        {trendingItems.map(item => (
                            <MenuItemCard key={item._id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                TOP PICKS SLIDER SECTION
            ════════════════════════════════ */}
            <section style={{ padding: '5.5rem 0 7rem', background: 'var(--color-primary)' }}>
                <div className="padd-container">
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ textTransform: 'uppercase' }}>
                            Top<span style={{ fontWeight: 300, color: 'var(--color-solidTwo)' }}> Picks</span>
                        </h3>
                        <p style={{ maxWidth: '32rem', margin: '0.5rem auto 0', textAlign: 'center' }}>
                            Discover fresh foods that delight your taste, nourish your body, and bring joy to every meal.
                        </p>
                    </div>

                    {/* Cards (5-per-view) */}
                    <div style={{
                        marginTop: '7rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {visiblePicks.map(pick => (
                            <ProductCard
                                key={pick.id}
                                name={pick.name}
                                category={pick.category}
                                price={pick.price}
                                rating={pick.rating}
                                prep={pick.prep}
                                cook={pick.cook}
                                img={pick.img}
                            />
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                        <button
                            onClick={() => setPicksPage(p => Math.max(0, p - 1))}
                            disabled={picksPage === 0}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '2.5rem', height: '2.5rem', borderRadius: '9999px',
                                border: '1px solid var(--color-gray-300)',
                                background: picksPage === 0 ? 'rgba(107,114,128,0.1)' : 'white',
                                cursor: picksPage === 0 ? 'not-allowed' : 'pointer',
                                opacity: picksPage === 0 ? 0.4 : 1,
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        {Array.from({ length: totalPicksPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPicksPage(i)}
                                style={{
                                    width: '0.625rem', height: '0.625rem', borderRadius: '9999px',
                                    background: i === picksPage ? 'var(--color-solid)' : 'var(--color-gray-300)',
                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                }}
                            />
                        ))}
                        <button
                            onClick={() => setPicksPage(p => Math.min(totalPicksPages - 1, p + 1))}
                            disabled={picksPage === totalPicksPages - 1}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '2.5rem', height: '2.5rem', borderRadius: '9999px',
                                border: '1px solid var(--color-gray-300)',
                                background: picksPage === totalPicksPages - 1 ? 'rgba(107,114,128,0.1)' : 'white',
                                cursor: picksPage === totalPicksPages - 1 ? 'not-allowed' : 'pointer',
                                opacity: picksPage === totalPicksPages - 1 ? 0.4 : 1,
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                FEATURES CARD SECTION
            ════════════════════════════════ */}
            <section style={{ padding: '5rem 0' }}>
                <div className="padd-container">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4rem',
                        alignItems: 'center',
                    }} className="features-wrapper">
                        {/* Left text */}
                        <div style={{ flex: 1, width: '100%' }}>
                            <div style={{ paddingBottom: '2.5rem' }}>
                                <h3 style={{ textTransform: 'uppercase' }}>
                                    Discover Our{' '}
                                    <span style={{ fontWeight: 300, color: 'var(--color-solidTwo)' }}>Food App's key features!</span>
                                </h3>
                                <p style={{ maxWidth: '32rem', marginTop: '0.5rem' }}>
                                    Discover fresh foods that delight your taste, nourish your body, and bring joy to every meal.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    {
                                        icon: <Truck size={22} color="white" strokeWidth={1.5} />,
                                        title: 'Fast Food Delivery',
                                        desc: 'Get your favorite meals delivered hot and fresh to your door in just a few minutes.',
                                    },
                                    {
                                        icon: <ShieldCheck size={22} color="white" strokeWidth={1.5} />,
                                        title: 'Secure Online Payments',
                                        desc: 'Pay securely using your preferred payment methods with a simple and quick checkout.',
                                    },
                                    {
                                        icon: <PhoneCall size={22} color="white" strokeWidth={1.5} />,
                                        title: '24/7 Order Support',
                                        desc: 'Our support team is always ready to assist you with any order queries or issues.',
                                    },
                                ].map(feat => (
                                    <div key={feat.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            height: '4rem',
                                            minWidth: '4rem',
                                            background: 'var(--color-solid)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '0.375rem',
                                        }}>
                                            {feat.icon}
                                        </div>
                                        <div>
                                            <h4>{feat.title}</h4>
                                            <p>{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right images */}
                        <div style={{ flex: 1, display: 'flex', gap: '1.25rem', width: '100%' }}>
                            <div style={{ flex: 1 }}>
                                <img
                                    src="/FoodieFiesta_files/features1-yAPg6YSN.png"
                                    alt="features"
                                    style={{ borderRadius: '1.5rem', width: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <img
                                    src="/FoodieFiesta_files/features3-CV5VzIIX.png"
                                    alt="features"
                                    style={{ borderRadius: '1.5rem', width: '100%', objectFit: 'cover' }}
                                />
                                <img
                                    src="/FoodieFiesta_files/features2-BtY-_hsT.png"
                                    alt="features"
                                    style={{ borderRadius: '1.5rem', width: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @media (min-width: 1024px) {
                        .features-wrapper { flex-direction: row !important; }
                    }
                `}</style>
            </section>

            {/* ════════════════════════════════
                USER REVIEWS SECTION
            ════════════════════════════════ */}
            <section style={{ padding: '5.5rem 0 7rem', background: 'var(--color-primary)' }}>
                <div className="padd-container">
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ textTransform: 'uppercase' }}>
                            What<span style={{ fontWeight: 300, color: 'var(--color-solidTwo)' }}>  People Says</span>
                        </h3>
                        <p style={{ maxWidth: '32rem', margin: '0.5rem auto 0', textAlign: 'center' }}>
                            Discover fresh foods that delight your taste, nourish your body, and bring joy to every meal.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {REVIEWS.map(review => (
                            <div
                                key={review.id}
                                style={{
                                    fontSize: '0.875rem',
                                    maxWidth: '26rem',
                                    paddingBottom: '1.5rem',
                                    borderRadius: '0.5rem',
                                    background: review.bg,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    flex: '1 1 280px',
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.25rem',
                                    borderBottom: '1px solid rgba(15,23,43,0.1)',
                                }}>
                                    <img
                                        src={review.img}
                                        alt={review.name}
                                        style={{ height: '3rem', width: '3rem', borderRadius: '9999px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h4>{review.name}</h4>
                                        <p>{review.role}</p>
                                    </div>
                                </div>
                                <div style={{ padding: '1.25rem 1.25rem 1.75rem' }}>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        <StarRating size={16} color="#000" />
                                    </div>
                                    <p style={{ color: 'var(--color-black)', marginTop: '1.25rem' }}>
                                        {review.review}
                                    </p>
                                </div>
                                <a href="#" style={{ color: 'var(--color-black)', textDecoration: 'underline', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                    Read more
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Home;
