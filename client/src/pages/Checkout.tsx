import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBasket, Trash2, Plus, Minus, ChevronRight,
    Truck, Utensils, ShoppingBag, MapPin, Phone, User,
    LogIn, CheckCircle2, Tag, ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/* ── Order type ── */
type OrderType = 'delivery' | 'takeaway' | 'dine_in';

/* ── Constants ── */
const TAX_RATE = 0.05;          // 5 % GST
const DELIVERY_CHARGE = 40;    // flat ₹40
const DINE_IN_CHARGE = 0;
const PACKING_CHARGE = 15;     // takeaway packing

/* ── Bill row helper ── */
const BillRow: React.FC<{ label: string; value: string; bold?: boolean; accent?: boolean; small?: boolean }> = ({
    label, value, bold, accent, small,
}) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.45rem 0',
        fontSize: small ? '0.78rem' : '0.875rem',
        fontWeight: bold ? 800 : 500,
        color: accent ? 'var(--color-solid)' : bold ? 'var(--color-textColor)' : 'var(--color-gray-500)',
    }}>
        <span>{label}</span>
        <span style={{ fontWeight: bold ? 900 : 600 }}>{value}</span>
    </div>
);

/* ══════════════════════════════════════════════════
   CHECKOUT PAGE
══════════════════════════════════════════════════ */
const Checkout: React.FC = () => {
    const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    const [orderType, setOrderType] = useState<OrderType>('delivery');
    const [form, setForm] = useState({
        name: user?.name ?? '', phone: '', address: '', tableNumber: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);

    /* ── Bill calculation ── */
    const tax = Math.round(subtotal * TAX_RATE);
    const extraCharge = orderType === 'delivery' ? DELIVERY_CHARGE : orderType === 'takeaway' ? PACKING_CHARGE : DINE_IN_CHARGE;
    const total = subtotal + tax + extraCharge;

    /* ── Validate ── */
    const validate = () => {
        const e: Record<string, string> = {};
        if (orderType === 'delivery') {
            if (!form.name.trim()) e.name = 'Name is required';
            if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/[\s\-]/g, ''))) e.phone = 'Enter a valid 10-digit number';
            if (!form.address.trim()) e.address = 'Delivery address is required';
        }
        if (orderType === 'dine_in') {
            if (!form.tableNumber.trim()) e.tableNumber = 'Table number is required';
        }
        setFormErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validate()) return;
        setPlacing(true);
        await new Promise(r => setTimeout(r, 1800)); // simulate API
        setPlaced(true);
        clearCart();
    };

    const set = (k: keyof typeof form, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        setFormErrors(p => ({ ...p, [k]: '' }));
    };

    /* ── Empty cart ── */
    if (cartItems.length === 0 && !placed) {
        return (
            <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingTop: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
                    <h2 style={{ fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>Explore our menu and add something delicious!</p>
                    <Link to="/menu" className="btn-solid" style={{ padding: '0.875rem 2.5rem', borderRadius: '9999px', fontSize: '1rem' }}>
                        Browse Menu
                    </Link>
                </div>
            </main>
        );
    }

    /* ── Order placed ── */
    if (placed) {
        return (
            <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingTop: '5.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <style>{`
                    @keyframes successPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                    @keyframes ripple { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
                `}</style>
                <div style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '480px' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                position: 'absolute', inset: `-${i * 20}px`, borderRadius: '9999px',
                                border: '2px solid rgba(34,197,94,0.3)',
                                animation: `ripple 1.8s ease-out ${(i - 1) * 0.3}s infinite`,
                            }} />
                        ))}
                        <div style={{
                            width: '90px', height: '90px', borderRadius: '9999px',
                            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 30px rgba(34,197,94,0.4)',
                            animation: 'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
                            position: 'relative', zIndex: 1,
                        }}>
                            <CheckCircle2 size={46} color="white" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h2 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '0.5rem' }}>Order Placed! 🎉</h2>
                    <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                        {orderType === 'delivery'
                            ? `Your food is being prepared and will be delivered to ${form.address}.`
                            : orderType === 'takeaway'
                                ? 'Your order is being prepared. Please collect it at the counter.'
                                : `Your food is being prepared for Table ${form.tableNumber}.`}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginBottom: '2.5rem' }}>Estimated time: 25–35 minutes</p>
                    <button onClick={() => navigate('/menu')} className="btn-solid" style={{ padding: '0.875rem 2.5rem', borderRadius: '9999px', fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
                        Order More
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '4rem' }}>
            <style>{`
                .checkout-input {
                    width: 100%; padding: 0.75rem 1rem;
                    border-radius: 0.75rem; font-size: 0.9rem; font-family: inherit;
                    color: var(--color-textColor); outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .checkout-input:focus { border-color: var(--color-solid) !important; box-shadow: 0 0 0 3px rgba(220,88,62,0.12); }
                .order-type-btn {
                    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
                    padding: 0.875rem; border-radius: 1rem; border: 2px solid rgba(220,88,62,0.15);
                    background: white; cursor: pointer; transition: all 0.2s;
                    font-size: 0.8rem; font-weight: 700; color: var(--color-gray-500);
                }
                .order-type-btn:hover { border-color: var(--color-solid); color: var(--color-solid); }
                .order-type-btn.active {
                    border-color: var(--color-solid); color: var(--color-solid);
                    background: rgba(220,88,62,0.06); box-shadow: 0 0 0 3px rgba(220,88,62,0.1);
                }
                @media (max-width: 900px) {
                    .checkout-grid { grid-template-columns: 1fr !important; }
                }
                @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                padding: '2.5rem 0 4.5rem', position: 'relative', overflow: 'hidden',
            }}>
                {[{ s: 300, top: '-90px', right: '-70px', o: 0.07 }, { s: 170, bottom: '-60px', left: '-40px', o: 0.06 }].map((c, i) => (
                    <div key={i} style={{ position: 'absolute', width: c.s, height: c.s, borderRadius: '9999px', background: 'white', opacity: c.o, top: (c as any).top, bottom: (c as any).bottom, left: (c as any).left, right: (c as any).right }} />
                ))}
                <div className="padd-container" style={{ position: 'relative', zIndex: 1 }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', padding: 0 }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,2.75rem)' }}>
                        <ShoppingBasket size={28} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Your Cart
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>
                        {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} · ₹{subtotal.toFixed(0)} subtotal
                    </p>
                </div>
            </div>

            <div className="padd-container checkout-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)',
                gap: '1.75rem',
                marginTop: '-2.5rem',
                alignItems: 'start',
            }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Cart Items */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShoppingBag size={18} color="var(--color-solid)" /> Order Items
                        </h3>
                        {cartItems.map((ci, idx) => (
                            <div
                                key={ci.item._id}
                                style={{
                                    display: 'flex', gap: '1rem', alignItems: 'center',
                                    padding: '0.875rem 0',
                                    borderBottom: idx < cartItems.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                    animation: 'slideUp 0.3s ease both',
                                    animationDelay: `${idx * 60}ms`,
                                }}
                            >
                                <img
                                    src={ci.item.image?.url}
                                    alt={ci.item.name}
                                    style={{ width: '70px', height: '70px', borderRadius: '0.875rem', objectFit: 'cover', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {ci.item.name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                                        ₹{ci.item.price.toFixed(0)} each
                                    </div>
                                    {/* Qty stepper */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={() => updateQuantity(ci.item._id, ci.quantity - 1)}
                                            style={{
                                                width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                                                border: '1.5px solid rgba(220,88,62,0.25)', background: 'white', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-solid)',
                                            }}
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: '1.5rem', textAlign: 'center' }}>{ci.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(ci.item._id, ci.quantity + 1)}
                                            style={{
                                                width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                                                border: 'none', background: 'var(--color-solid)', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                            }}
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-solidOne)' }}>
                                        ₹{(ci.item.price * ci.quantity).toFixed(0)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(ci.item._id)}
                                        style={{
                                            marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem',
                                            fontSize: '0.72rem', fontWeight: 600,
                                        }}
                                    >
                                        <Trash2 size={13} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Type */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>How would you like your order?</h3>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {([
                                { type: 'delivery', icon: <Truck size={22} />, label: 'Delivery' },
                                { type: 'takeaway', icon: <ShoppingBag size={22} />, label: 'Take Away' },
                                { type: 'dine_in', icon: <Utensils size={22} />, label: 'Dine In' },
                            ] as const).map(({ type, icon, label }) => (
                                <button
                                    key={type}
                                    className={`order-type-btn ${orderType === type ? 'active' : ''}`}
                                    onClick={() => setOrderType(type)}
                                >
                                    {icon}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Details */}
                    {orderType === 'delivery' && (
                        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', animation: 'slideUp 0.3s ease' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Truck size={17} color="var(--color-solid)" /> Delivery Details
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                {/* Name */}
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                                        <User size={13} /> Full Name *
                                    </label>
                                    <input
                                        className="checkout-input"
                                        placeholder="Your name"
                                        value={form.name}
                                        onChange={e => set('name', e.target.value)}
                                        style={{ border: `1.5px solid ${formErrors.name ? '#ef4444' : 'rgba(220,88,62,0.2)'}` }}
                                    />
                                    {formErrors.name && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.2rem' }}>{formErrors.name}</p>}
                                </div>
                                {/* Phone */}
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                                        <Phone size={13} /> Phone *
                                    </label>
                                    <input
                                        className="checkout-input"
                                        placeholder="10-digit mobile number"
                                        value={form.phone}
                                        onChange={e => set('phone', e.target.value)}
                                        style={{ border: `1.5px solid ${formErrors.phone ? '#ef4444' : 'rgba(220,88,62,0.2)'}` }}
                                    />
                                    {formErrors.phone && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.2rem' }}>{formErrors.phone}</p>}
                                </div>
                                {/* Address */}
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gray-600)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                                        <MapPin size={13} /> Delivery Address *
                                    </label>
                                    <textarea
                                        className="checkout-input"
                                        rows={3}
                                        placeholder="House/Flat No, Street, Landmark, City"
                                        value={form.address}
                                        onChange={e => set('address', e.target.value)}
                                        style={{ border: `1.5px solid ${formErrors.address ? '#ef4444' : 'rgba(220,88,62,0.2)'}`, resize: 'vertical' }}
                                    />
                                    {formErrors.address && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.2rem' }}>{formErrors.address}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dine In: Table Number */}
                    {orderType === 'dine_in' && (
                        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', animation: 'slideUp 0.3s ease' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Utensils size={17} color="var(--color-solid)" /> Table Number
                            </h3>
                            <input
                                className="checkout-input"
                                placeholder="Enter your table number (e.g. A3)"
                                value={form.tableNumber}
                                onChange={e => set('tableNumber', e.target.value)}
                                style={{ border: `1.5px solid ${formErrors.tableNumber ? '#ef4444' : 'rgba(220,88,62,0.2)'}` }}
                            />
                            {formErrors.tableNumber && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.2rem' }}>{formErrors.tableNumber}</p>}
                        </div>
                    )}

                    {/* Takeaway note */}
                    {orderType === 'takeaway' && (
                        <div style={{ background: 'rgba(220,88,62,0.06)', borderRadius: '1rem', padding: '1rem 1.25rem', border: '1.5px solid rgba(220,88,62,0.2)', animation: 'slideUp 0.3s ease', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <ShoppingBag size={18} color="var(--color-solid)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-solid)', marginBottom: '0.2rem' }}>Ready in 15–20 minutes</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Your order will be packed and ready for pick-up at our counter.</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT COLUMN: Bill ── */}
                <div style={{ position: 'sticky', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={17} color="var(--color-solid)" /> Bill Summary
                        </h3>

                        <BillRow label="Subtotal" value={`₹${subtotal.toFixed(0)}`} />
                        <BillRow label="GST (5%)" value={`₹${tax.toFixed(0)}`} small />
                        {orderType === 'delivery' && (
                            <BillRow label="Delivery charge" value={`₹${DELIVERY_CHARGE}`} small />
                        )}
                        {orderType === 'takeaway' && (
                            <BillRow label="Packing charge" value={`₹${PACKING_CHARGE}`} small />
                        )}
                        {orderType === 'dine_in' && (
                            <BillRow label="Service charge" value="Nil" small accent />
                        )}

                        <div style={{ borderTop: '2px solid rgba(0,0,0,0.06)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                            <BillRow label="Total" value={`₹${total.toFixed(0)}`} bold accent />
                        </div>

                        <div style={{ marginTop: '0.5rem', background: 'rgba(34,197,94,0.08)', borderRadius: '0.625rem', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                            🎉 You save ₹{Math.round(subtotal * 0.1).toFixed(0)} with Annapurna loyalty discount
                        </div>

                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: '1rem', paddingTop: '1rem' }}>
                            {/* Order type badge */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                                {orderType === 'delivery' && <><Truck size={14} color="var(--color-solid)" /><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Home Delivery</span></>}
                                {orderType === 'takeaway' && <><ShoppingBag size={14} color="var(--color-solid)" /><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Take Away</span></>}
                                {orderType === 'dine_in' && <><Utensils size={14} color="var(--color-solid)" /><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Dine In</span></>}
                            </div>

                            {/* Sign in gate / Place order button */}
                            {!isLoggedIn ? (
                                <div style={{ background: 'rgba(220,88,62,0.05)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', border: '1.5px dashed rgba(220,88,62,0.25)' }}>
                                    <LogIn size={28} color="var(--color-solid)" style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>Sign in to place your order</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '1rem' }}>You must be logged in to complete your purchase.</p>
                                    <Link
                                        to="/login"
                                        className="btn-solid"
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            padding: '0.75rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700,
                                        }}
                                    >
                                        <LogIn size={16} /> Sign In
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placing}
                                    style={{
                                        width: '100%', padding: '0.9rem', borderRadius: '9999px', border: 'none',
                                        background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                                        color: 'white', fontWeight: 800, fontSize: '1rem',
                                        cursor: placing ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        boxShadow: '0 4px 20px rgba(220,88,62,0.4)',
                                        opacity: placing ? 0.75 : 1, transition: 'all 0.2s',
                                    }}
                                >
                                    {placing ? (
                                        <>
                                            <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '9999px', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                                            Placing order…
                                        </>
                                    ) : (
                                        <><ChevronRight size={18} /> Place Order · ₹{total.toFixed(0)}</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Continue shopping */}
                    <Link to="/menu" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-solid)', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                        <ArrowLeft size={15} /> Continue browsing
                    </Link>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </main>
    );
};

export default Checkout;
