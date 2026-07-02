import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Star, ChevronLeft, ChevronRight, Truck,
    ShieldCheck, PhoneCall
} from 'lucide-react';
import type { MenuItem } from '../types/menu.types';
import MenuItemCard from '../components/common/MenuItemCard';

/* ────────────────────────────────────────────────────────
   STATIC DATA
──────────────────────────────────────────────────────── */

// Trending slider – using seed data Cloudinary images
const TRENDING_SLIDES = [
    {
        id: 't1',
        title: 'Paneer Tikka',
        category: 'Starter',
        description: 'Smoky, marinated cottage cheese cubes grilled to perfection with colourful peppers.',
        price: '₹180',
        img: 'https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887062/restaurant_menu/ejo5jagvenr771fo7d7b.jpg',
    },
    {
        id: 't2',
        title: 'Butter Chicken',
        category: 'Main Course',
        description: 'Tender chicken in a rich, velvety tomato butter gravy – India\'s most loved comfort food.',
        price: '₹350',
        img: 'https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887208/restaurant_menu/ay6sxpjuku3wvmsei6pp.jpg',
    },
    {
        id: 't3',
        title: 'Chicken Biryani',
        category: 'Main Course',
        description: 'Fragrant basmati rice layered with spiced chicken, saffron and caramelised onions.',
        price: '₹320',
        img: 'https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887318/restaurant_menu/l0n0vsyd3aup9wref6qq.jpg',
    },
    {
        id: 't4_placeholder',
        title: 'Chicken Biryani',
        category: 'Main Course',
        description: 'Fragrant basmati rice layered with spiced chicken, saffron and caramelised onions.',
        price: '₹320',
        img: 'https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887318/restaurant_menu/l0n0vsyd3aup9wref6qq.jpg',
    }
];
const TOP_PICKS =[
  {
    "id": "p1",
    "name": "Spicy Chicken Curry",
    "category": "Curry",
    "price": "₹5",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903501/restaurant_menu_dishes/p1.jpg"
  },
  {
    "id": "p2",
    "name": "Vegetarian Chickpea Curry",
    "category": "Curry",
    "price": "₹10",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903503/restaurant_menu_dishes/p2.jpg"
  },
  {
    "id": "p3",
    "name": "Beef Vindaloo",
    "category": "Curry",
    "price": "₹20",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903504/restaurant_menu_dishes/p3.jpg"
  },
  {
    "id": "p4",
    "name": "Creamy Paneer Butter Masala",
    "category": "Curry",
    "price": "₹15",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903727/restaurant_menu_dishes/p1.jpg"
  },
  {
    "id": "p5",
    "name": "Lamb Rogan Josh",
    "category": "Curry",
    "price": "₹5",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903505/restaurant_menu_dishes/p5.jpg"
  },
  {
    "id": "p6",
    "name": "Fish Curry with Coconut Milk",
    "category": "Curry",
    "price": "₹10",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903506/restaurant_menu_dishes/p6.jpg"
  },
  {
    "id": "p7",
    "name": "Margherita Pizza",
    "category": "Pizza",
    "price": "₹30",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903508/restaurant_menu_dishes/p7.jpg"
  },
  {
    "id": "p8",
    "name": "Pepperoni Pizza",
    "category": "Pizza",
    "price": "₹30",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903509/restaurant_menu_dishes/p8.jpg"
  },
  {
    "id": "p9",
    "name": "Egg Curry with Spices",
    "category": "Curry",
    "price": "₹5",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903511/restaurant_menu_dishes/p9.jpg"
  },
  {
    "id": "p10",
    "name": "Vegetable Fried Rice",
    "category": "Rice",
    "price": "₹15",
    "rating": 5,
    "prep": "5m",
    "cook": "20m",
    "img": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782903512/restaurant_menu_dishes/p10.jpg"
  }
]

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
        img: 'https://res.cloudinary.com/jjfdbcxj/image/upload/f_auto,q_auto/v1782897219/MjUwMjA0MDA_w9xvib',
        bg: '#aed6ff',
        review: "I've been ordering through FoodieFiesta for over a year and it never disappoints. Delivery is always lightning-fast, portions are generous and the packaging keeps everything perfectly fresh. The biryani is my absolute go-to!",
    },
];

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
   MAPPED DATA FOR SHARED COMPONENT
──────────────────────────────────────────────────────── */
const MAPPED_TRENDING: MenuItem[] = TRENDING_SLIDES.map(slide => ({
    _id: slide.id,
    name: slide.title,
    description: slide.description,
    price: parseFloat(slide.price.replace('₹', '')),
    category: slide.category,
    image: { url: slide.img, public_id: '' },
    isVeg: slide.id === 't1' || slide.id === 't2' ? false : true,
    isTrending: true,
    rating: 4.7,
    available: true,
    createdAt: new Date().toISOString()
}));

const MAPPED_PICKS: MenuItem[] = TOP_PICKS.map(pick => ({
    _id: pick.id,
    name: pick.name,
    description: "Chef's special preparation with authentic spices.",
    price: parseFloat(pick.price.replace('₹', '')),
    category: pick.category,
    image: { url: pick.img, public_id: '' },
    isVeg: pick.name.toLowerCase().includes('chicken') || pick.name.toLowerCase().includes('beef') || pick.name.toLowerCase().includes('lamb') || pick.name.toLowerCase().includes('fish') || pick.name.toLowerCase().includes('egg') || pick.name.toLowerCase().includes('pepperoni') ? false : true,
    isTrending: false,
    rating: pick.rating,
    available: true,
    createdAt: new Date().toISOString()
}));

// ProductCard and MenuItemCard removed in favor of common MenuItemCard component

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
            setHeroIdx((prev: number) => (prev + 1) % TRENDING_SLIDES.length);
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

    const visiblePicks = MAPPED_PICKS.slice(picksPage * picksPerPage, (picksPage + 1) * picksPerPage);

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
                        <h3 className="animate-fadeInUp" style={{ color: 'var(--color-textColor)' }}>Fresh Bites for Every Mood</h3>
                        <h2 className="animate-fadeInUp delay-100" style={{ textTransform: 'uppercase', marginBottom: 0, letterSpacing: '0.22rem' }}>
                            <span style={{ color: 'var(--color-solidOne)' }}>Get More </span>
                            <span style={{ color: 'var(--color-solidTwo)' }}>for Less – 25% Off!</span>
                        </h2>
                        <h1 className="animate-fadeInUp delay-200" style={{ fontWeight: 800, lineHeight: 1 }}>on Rice &amp; Curries</h1>
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
                        <Link to="/menu" className="animate-fadeInUp delay-300">
                            <button className="btn-solid" style={{ borderRadius: 0, padding: '1.25rem', width: '13rem', fontSize: '1.125rem', fontWeight: 700, marginTop: '2rem' }}>
                                Shop Now
                            </button>
                        </Link>
                    </div>

                    {/* User review badge (bottom-left of hero) */}
                    <div className="animate-fadeInUp delay-400" style={{ marginTop: '2.25rem', paddingBottom: '2.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {/* User avatars */}
                            <div style={{ display: 'flex' }}>
                                {['https://res.cloudinary.com/jjfdbcxj/image/upload/f_auto,q_auto/v1782897219/MjUwMjA0MDA_w9xvib', 'https://www.gazijarin.com/assets/me2.jpg'].map((src, i) => (
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
                        <h3 className="animate-fadeInUp" style={{ textTransform: 'uppercase' }}>
                            Trending<span style={{ fontWeight: 300, color: 'var(--color-solidTwo)' }}> Now</span>
                        </h3>
                        <p className="animate-fadeIn delay-200" style={{ maxWidth: '32rem', margin: '0.5rem auto 0', textAlign: 'center' }}>
                            Discover fresh foods that delight your taste, nourish your body, and bring joy to every meal.
                        </p>
                    </div>

                    {/* Big image slider */}
                    <div className="animate-scaleIn delay-200" style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
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

                    <div style={{
                        marginTop: '3.5rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '2rem',
                    }}>
                        {MAPPED_TRENDING.map((item: MenuItem, idx: number) => (
                            <MenuItemCard
                                key={item._id}
                                item={item}
                                index={idx}
                            />
                        ))}
                        {/* Also show DB trending items if available */}
                        {trendingItems.map((item: MenuItem, idx: number) => (
                            <MenuItemCard key={item._id} item={item} index={MAPPED_TRENDING.length + idx} />
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

                    <div style={{
                        marginTop: '3.5rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '2rem',
                    }}>
                        {visiblePicks.map((pick: MenuItem, idx: number) => (
                            <MenuItemCard
                                key={pick._id}
                                item={pick}
                                index={idx}
                            />
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                        <button
                            onClick={() => setPicksPage((p: number) => Math.max(0, p - 1))}
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
                            onClick={() => setPicksPage((p: number) => Math.min(totalPicksPages - 1, p + 1))}
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
                                        crossOrigin="anonymous"
                                        onError={(e) => { e.currentTarget.style.background = '#ccc'; e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random&size=48`; }}
                                        style={{ height: '3rem', width: '3rem', minWidth: '3rem', borderRadius: '9999px', objectFit: 'cover', flexShrink: 0, display: 'block' }}
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
