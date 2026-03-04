import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, FileText, Calendar,
    Edit3, Save, X, CheckCircle2, Shield,
    ShoppingBag, Clock, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/* ── Types matching the backend model ── */
interface ProfileForm {
    name: string;
    phone: string;
    bio: string;
    dateOfBirth: string;   // stored as ISO date string in inputs
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}

const EMPTY_FORM: ProfileForm = {
    name: '', phone: '', bio: '', dateOfBirth: '',
    address: { street: '', city: '', state: '', pincode: '' },
};

/* ── Small helper: labelled info row (read-only) ── */
const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) =>
    value ? (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.625rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ color: 'var(--color-solid)', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
            <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.125rem' }}>{label}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-textColor)' }}>{value}</div>
            </div>
        </div>
    ) : null;

/* ── Labelled text input ── */
const FormField: React.FC<{
    label: string; icon: React.ReactNode; id: string;
    type?: string; value: string; placeholder?: string;
    onChange: (v: string) => void; required?: boolean;
    multiline?: boolean;
}> = ({ label, icon, id, type = 'text', value, placeholder, onChange, required, multiline }) => (
    <div>
        <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.375rem' }}>
            {icon} {label} {required && <span style={{ color: 'var(--color-solid)' }}>*</span>}
        </label>
        {multiline ? (
            <textarea
                id={id} rows={3} value={value} placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
                style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.875rem',
                    border: '1.5px solid rgba(220,88,62,0.2)', fontFamily: 'inherit',
                    fontSize: '0.9rem', color: 'var(--color-textColor)', outline: 'none',
                    background: 'rgba(255,244,241,0.4)', resize: 'vertical', boxSizing: 'border-box',
                }}
            />
        ) : (
            <input
                id={id} type={type} value={value} placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
                style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.875rem',
                    border: '1.5px solid rgba(220,88,62,0.2)', fontFamily: 'inherit',
                    fontSize: '0.9rem', color: 'var(--color-textColor)', outline: 'none',
                    background: 'rgba(255,244,241,0.4)', boxSizing: 'border-box',
                }}
            />
        )}
    </div>
);

/* ══════════════════════════════════════════════════
   PROFILE PAGE
══════════════════════════════════════════════════ */
const Profile: React.FC = () => {
    const { user, isLoggedIn, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<any>(null);
    const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) navigate('/login', { state: { from: { pathname: '/profile' } } });
    }, [isLoggedIn]);

    // Fetch full profile from /api/auth/me
    useEffect(() => {
        if (!isLoggedIn) return;
        api.get('/auth/me').then(res => {
            const data = res.data.data;
            setProfile(data);
            setForm({
                name: data.name ?? '',
                phone: data.phone ?? '',
                bio: data.bio ?? '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                address: {
                    street: data.address?.street ?? '',
                    city: data.address?.city ?? '',
                    state: data.address?.state ?? '',
                    pincode: data.address?.pincode ?? '',
                },
            });
        }).catch(() => setError('Could not load profile.')).finally(() => setLoading(false));
    }, [isLoggedIn]);

    const handleSave = async () => {
        if (!form.name.trim()) { setError('Name cannot be empty.'); return; }
        setSaving(true); setError('');
        try {
            const res = await api.patch('/auth/profile', {
                name: form.name,
                phone: form.phone,
                bio: form.bio,
                dateOfBirth: form.dateOfBirth || undefined,
                address: form.address,
            });
            setProfile(res.data.data);
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (!profile) return;
        setForm({
            name: profile.name ?? '',
            phone: profile.phone ?? '',
            bio: profile.bio ?? '',
            dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
            address: {
                street: profile.address?.street ?? '',
                city: profile.address?.city ?? '',
                state: profile.address?.state ?? '',
                pincode: profile.address?.pincode ?? '',
            },
        });
        setEditing(false);
        setError('');
    };

    const setAddr = (k: keyof ProfileForm['address'], v: string) =>
        setForm(p => ({ ...p, address: { ...p.address, [k]: v } }));

    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : '';

    const hasAddress = !!(profile?.address?.street || profile?.address?.city || profile?.address?.state);
    const fullAddress = hasAddress ? [
        profile.address.street,
        profile.address.city,
        profile.address.state,
        profile.address.pincode,
    ].filter(Boolean).join(', ') : '';

    // Avatar initials
    const initials = (profile?.name ?? user?.name ?? 'U').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

    if (!isLoggedIn) return null;

    return (
        <main style={{ background: 'var(--color-primary)', minHeight: '100vh', paddingBottom: '4rem' }}>
            <style>{`
                @keyframes profileIn { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }
                @keyframes savePop { from { transform:scale(0);opacity:0; } to { transform:scale(1);opacity:1; } }
                .profile-form-input:focus-within { border-color: var(--color-solid) !important; box-shadow: 0 0 0 3px rgba(220,88,62,0.1); }
                .edit-btn:hover { background: rgba(220,88,62,0.08) !important; }
            `}</style>

            {/* Hero gradient header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-solidOne), var(--color-solid), var(--color-solidTwo))',
                padding: '5rem 0 5rem', position: 'relative', overflow: 'hidden',
            }}>
                {[{ w: 280, t: '-90px', r: '-70px', o: 0.07 }, { w: 160, b: '-60px', l: '15%', o: 0.05 }].map((c, i) => (
                    <div key={i} style={{ position: 'absolute', width: c.w, height: c.w, borderRadius: '9999px', background: 'white', opacity: c.o, top: (c as any).t, bottom: (c as any).b, left: (c as any).l, right: (c as any).r }} />
                ))}

                <div className="padd-container" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        {profile?.picture ? (
                            <img src={profile.picture} alt={profile.name} style={{ width: '88px', height: '88px', borderRadius: '9999px', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} />
                        ) : (
                            <div style={{ width: '88px', height: '88px', borderRadius: '9999px', background: 'rgba(255,255,255,0.2)', border: '4px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                                {initials}
                            </div>
                        )}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                            <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2rem)', margin: 0 }}>
                                {loading ? '…' : (profile?.name ?? user?.name)}
                            </h1>
                            {isAdmin && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.625rem', borderRadius: '9999px', letterSpacing: '0.06em' }}>
                                    <Shield size={11} /> ADMIN
                                </span>
                            )}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                            {profile?.email ?? user?.email}
                        </p>
                        {memberSince && (
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={12} /> Member since {memberSince}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="padd-container" style={{
                marginTop: '-2.5rem', display: 'grid',
                gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)',
                gap: '1.5rem', alignItems: 'start',
                animation: mounted ? 'profileIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            }}>

                {/* ── LEFT: Profile info / edit form ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Saved banner */}
                    {saved && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '0.875rem', padding: '0.75rem 1rem', animation: 'savePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                            <CheckCircle2 size={18} color="#16a34a" />
                            <span style={{ fontWeight: 700, color: '#15803d', fontSize: '0.9rem' }}>Profile saved successfully!</span>
                        </div>
                    )}

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#dc2626', fontWeight: 600, fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    {/* Main card */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                        {/* Card header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={17} color="var(--color-solid)" /> Personal Information
                            </h2>
                            {!loading && !editing && (
                                <button
                                    className="edit-btn"
                                    onClick={() => setEditing(true)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '9999px', border: '1.5px solid rgba(220,88,62,0.25)', background: 'white', cursor: 'pointer', color: 'var(--color-solid)', fontSize: '0.8rem', fontWeight: 700, transition: 'background 0.2s' }}
                                >
                                    <Edit3 size={13} /> Edit Profile
                                </button>
                            )}
                            {editing && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.875rem', borderRadius: '9999px', border: '1.5px solid rgba(0,0,0,0.12)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                                        <X size={13} /> Cancel
                                    </button>
                                    <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', background: 'linear-gradient(135deg,var(--color-solidOne),var(--color-solid))', color: 'white', cursor: saving ? 'wait' : 'pointer', fontWeight: 700, fontSize: '0.8rem', opacity: saving ? 0.75 : 1 }}>
                                        {saving ? <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '9999px', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Saving…</> : <><Save size={13} /> Save</>}
                                    </button>
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '9999px', border: '3px solid rgba(220,88,62,0.2)', borderTopColor: 'var(--color-solid)', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                            </div>
                        ) : editing ? (
                            /* ── EDIT FORM ── */
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                                <FormField id="name" label="Full Name" required icon={<User size={13} />} value={form.name} placeholder="Your full name" onChange={v => setForm(p => ({ ...p, name: v }))} />
                                <FormField id="phone" label="Phone Number" icon={<Phone size={13} />} type="tel" value={form.phone} placeholder="10-digit mobile number" onChange={v => setForm(p => ({ ...p, phone: v }))} />
                                <FormField id="dob" label="Date of Birth" icon={<Calendar size={13} />} type="date" value={form.dateOfBirth} onChange={v => setForm(p => ({ ...p, dateOfBirth: v }))} />
                                <FormField id="bio" label="About Me" icon={<FileText size={13} />} value={form.bio} placeholder="A short bio about yourself…" onChange={v => setForm(p => ({ ...p, bio: v }))} multiline />

                                {/* Address section */}
                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        <MapPin size={13} color="var(--color-solid)" /> Delivery Address
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <FormField id="street" label="Street / Flat No." icon={<MapPin size={13} />} value={form.address.street} placeholder="House number, street, landmark" onChange={v => setAddr('street', v)} />
                                        </div>
                                        <FormField id="city" label="City" icon={<MapPin size={13} />} value={form.address.city} placeholder="City" onChange={v => setAddr('city', v)} />
                                        <FormField id="state" label="State" icon={<MapPin size={13} />} value={form.address.state} placeholder="State" onChange={v => setAddr('state', v)} />
                                        <FormField id="pincode" label="Pincode" icon={<MapPin size={13} />} value={form.address.pincode} placeholder="Pincode" onChange={v => setAddr('pincode', v)} type="number" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ── READ-ONLY VIEW ── */
                            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <InfoRow icon={<Mail size={15} />} label="Email" value={profile?.email} />
                                <InfoRow icon={<Phone size={15} />} label="Phone" value={profile?.phone} />
                                <InfoRow icon={<Calendar size={15} />} label="Date of Birth" value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined} />
                                <InfoRow icon={<FileText size={15} />} label="About" value={profile?.bio} />
                                <InfoRow icon={<MapPin size={15} />} label="Address" value={fullAddress} />
                                {!profile?.phone && !profile?.bio && !fullAddress && (
                                    <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-gray-400)' }}>
                                        <User size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Your profile is incomplete</p>
                                        <p style={{ fontSize: '0.78rem' }}>Click <strong>Edit Profile</strong> to add your details.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: Stats + quick-links ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '6rem' }}>

                    {/* Account type */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.25rem 1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Account</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                <span style={{ color: '#64748b', fontWeight: 600 }}>Login method</span>
                                <span style={{ fontWeight: 800, textTransform: 'capitalize', color: 'var(--color-textColor)' }}>
                                    {profile?.provider === 'google' ? '🔵 Google' : '📧 Email'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                <span style={{ color: '#64748b', fontWeight: 600 }}>Account type</span>
                                <span style={{ fontWeight: 800, color: isAdmin ? '#3b82f6' : 'var(--color-textColor)' }}>
                                    {isAdmin ? '🛡️ Admin' : '👤 Customer'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                <span style={{ color: '#64748b', fontWeight: 600 }}>Member since</span>
                                <span style={{ fontWeight: 800 }}>{memberSince}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.25rem 1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Links</h3>
                        {([
                            { to: '/menu', icon: <Star size={16} />, label: 'Browse Menu', desc: 'Discover our specialities' },
                            { to: '/reservation', icon: <Calendar size={16} />, label: 'Book a Table', desc: 'Reserve your spot' },
                            { to: '/checkout', icon: <ShoppingBag size={16} />, label: 'View Cart', desc: 'See your current order' },
                        ] as const).map(({ to, icon, label, desc }) => (
                            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.875rem', textDecoration: 'none', color: 'inherit', transition: 'background 0.2s', marginBottom: '0.375rem' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,88,62,0.06)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '0.75rem', background: 'rgba(220,88,62,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-solid)', flexShrink: 0 }}>{icon}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{label}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform:rotate(360deg); } }
                @media (max-width:860px) {
                    .padd-container > div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </main>
    );
};

export default Profile;
