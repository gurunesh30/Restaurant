import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Edit2, Trash2, Search, X, CheckCircle2, Flame,
    Upload, Leaf, Drumstick, ToggleLeft, ToggleRight, Loader2,
} from 'lucide-react';
import api from '../../services/api';

/* ── Types ── */
interface Category { _id: string; name: string; }
interface MenuItem {
    _id: string; name: string; description: string; price: number;
    category: Category | string; image: { url: string; public_id: string };
    isVeg: boolean; isTrending: boolean; available: boolean; rating: number;
}
interface FormState {
    name: string; description: string; price: string;
    categoryId: string; isVeg: boolean; isTrending: boolean; available: boolean;
    imageFile: File | null; imagePreview: string;
}
const EMPTY: FormState = { name: '', description: '', price: '', categoryId: '', isVeg: true, isTrending: false, available: true, imageFile: null, imagePreview: '' };

/* ── Dialog backdrop ── */
const Dialog: React.FC<{ onClose: () => void; title: string; children: React.ReactNode }> = ({ onClose, title, children }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
        <div style={{ position: 'relative', background: 'white', borderRadius: '1.5rem', width: '100%', maxWidth: '580px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'dialogIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{title}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>{children}</div>
        </div>
    </div>
);

/* ── Small labelled input ── */
const LF: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
    <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.375rem' }}>
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        {children}
    </div>
);
const inputSty = { width: '100%', padding: '0.6875rem 0.875rem', borderRadius: '0.75rem', border: '1.5px solid rgba(0,0,0,0.12)', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const };

/* ══════════════════════════════════════════════════ */
const AdminMenu: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editItem, setEditItem] = useState<MenuItem | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [toggling, setToggling] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [mRes, cRes] = await Promise.all([
                api.get('/menu?limit=100'),
                api.get('/categories'),
            ]);
            setItems(mRes.data.data);
            setCategories(cRes.data.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => { loadData(); }, []);

    const openAdd = () => { setEditItem(null); setForm(EMPTY); setSaveErr(''); setShowDialog(true); };
    const openEdit = (item: MenuItem) => {
        const catId = typeof item.category === 'object' ? (item.category as Category)._id : item.category;
        setEditItem(item);
        setForm({ name: item.name, description: item.description, price: String(item.price), categoryId: catId, isVeg: item.isVeg, isTrending: item.isTrending, available: item.available, imageFile: null, imagePreview: item.image?.url ?? '' });
        setSaveErr('');
        setShowDialog(true);
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setForm(p => ({ ...p, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.price || !form.categoryId) { setSaveErr('Name, price and category are required.'); return; }
        if (!editItem && !form.imageFile) { setSaveErr('Please upload an image.'); return; }
        setSaving(true); setSaveErr('');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('description', form.description);
            fd.append('price', form.price);
            fd.append('categoryId', form.categoryId);
            fd.append('isVeg', String(form.isVeg));
            fd.append('isTrending', String(form.isTrending));
            fd.append('available', String(form.available));
            if (form.imageFile) fd.append('image', form.imageFile);

            if (editItem) {
                await api.put(`/menu/${editItem._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/menu', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setShowDialog(false);
            await loadData();
        } catch (err: any) {
            setSaveErr(err?.response?.data?.message || 'Failed to save. Check Cloudinary env vars.');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try { await api.delete(`/menu/${deleteId}`); setDeleteId(null); await loadData(); }
        catch (e) { console.error(e); }
        finally { setDeleting(false); }
    };

    const toggleAvail = async (id: string) => {
        setToggling(id);
        try { await api.patch(`/menu/${id}/toggle`); await loadData(); }
        catch (e) { console.error(e); }
        finally { setToggling(null); }
    };

    const toggleTrend = async (id: string) => {
        setToggling(id + 't');
        try { await api.patch(`/menu/${id}/trending`); await loadData(); }
        catch (e) { console.error(e); }
        finally { setToggling(null); }
    };

    const filtered = items.filter(item => {
        const catId = typeof item.category === 'object' ? (item.category as Category)._id : item.category;
        const matchCat = !filterCat || catId === filterCat;
        const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <style>{`
                @keyframes dialogIn { from { opacity:0; transform:translateY(-20px) scale(0.97); } to { opacity:1; transform:none; } }
                @keyframes spin { to { transform:rotate(360deg); } }
                .menu-item-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
            `}</style>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', borderRadius: '0.875rem', padding: '0.625rem 1rem', border: '1.5px solid rgba(0,0,0,0.08)' }}>
                    <Search size={16} color="#94a3b8" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes…" style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', flex: 1 }} />
                </div>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '0.625rem 1rem', borderRadius: '0.875rem', border: '1.5px solid rgba(0,0,0,0.08)', fontFamily: 'inherit', fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.875rem', border: 'none', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <Plus size={16} /> Add Dish
                </button>
            </div>

            {/* Count */}
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{filtered.length} dish{filtered.length !== 1 ? 'es' : ''}</div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid rgba(249,115,22,0.2)', borderTopColor: '#f97316', borderRadius: '9999px', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
                    {filtered.map(item => {
                        const catName = typeof item.category === 'object' ? (item.category as Category).name : '—';
                        return (
                            <div key={item._id} className="menu-item-card" style={{ background: 'white', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', transition: 'all 0.2s', opacity: item.available ? 1 : 0.65 }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={item.image?.url} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                    {!item.available && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.875rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>UNAVAILABLE</span>
                                        </div>
                                    )}
                                    {item.isTrending && (
                                        <div style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', background: '#f97316', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <Flame size={10} /> TREND
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: '0.625rem', left: '0.625rem', background: item.isVeg ? '#16a34a' : '#dc2626', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.isVeg ? <Leaf size={11} color="white" /> : <Drumstick size={11} color="white" />}
                                    </div>
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{catName}</div>
                                        </div>
                                        <div style={{ fontWeight: 900, fontSize: '1rem', color: '#ea580c' }}>₹{item.price}</div>
                                    </div>
                                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.5rem 0 0.875rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>

                                    {/* Toggle row */}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <button onClick={() => toggleAvail(item._id)} disabled={toggling === item._id} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.4rem', borderRadius: '0.625rem', border: `1.5px solid ${item.available ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)'}`, background: item.available ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.05)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, color: item.available ? '#16a34a' : '#dc2626' }}>
                                            {item.available ? <><ToggleRight size={13} /> Available</> : <><ToggleLeft size={13} /> Unavail.</>}
                                        </button>
                                        <button onClick={() => toggleTrend(item._id)} disabled={toggling === item._id + 't'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.4rem', borderRadius: '0.625rem', border: `1.5px solid ${item.isTrending ? 'rgba(249,115,22,0.35)' : 'rgba(0,0,0,0.1)'}`, background: item.isTrending ? 'rgba(249,115,22,0.08)' : 'transparent', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, color: item.isTrending ? '#ea580c' : '#94a3b8' }}>
                                            <Flame size={12} /> {item.isTrending ? 'Trending' : 'Set Trend'}
                                        </button>
                                    </div>

                                    {/* Edit / Delete */}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEdit(item)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.5rem', borderRadius: '0.75rem', border: '1.5px solid rgba(0,0,0,0.1)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>
                                            <Edit2 size={13} /> Edit
                                        </button>
                                        <button onClick={() => setDeleteId(item._id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '0.75rem', border: '1.5px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', cursor: 'pointer', color: '#dc2626' }}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Dialog */}
            {showDialog && (
                <Dialog title={editItem ? 'Edit Dish' : 'Add New Dish'} onClose={() => setShowDialog(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {saveErr && <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#dc2626', fontWeight: 600, fontSize: '0.875rem' }}>{saveErr}</div>}

                        {/* Image upload */}
                        <LF label="Dish Image" required={!editItem}>
                            <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed rgba(249,115,22,0.35)', borderRadius: '0.875rem', padding: '1rem', cursor: 'pointer', textAlign: 'center', background: 'rgba(249,115,22,0.03)', overflow: 'hidden' }}>
                                {form.imagePreview ? (
                                    <img src={form.imagePreview} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '0.625rem' }} />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', color: '#94a3b8' }}>
                                        <Upload size={28} />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Click to upload image</span>
                                        <span style={{ fontSize: '0.72rem' }}>JPG, PNG, WebP</span>
                                    </div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                        </LF>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <LF label="Dish Name" required>
                                    <input style={inputSty} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Butter Chicken" />
                                </LF>
                            </div>
                            <LF label="Price (₹)" required>
                                <input style={inputSty} type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 280" />
                            </LF>
                            <LF label="Category" required>
                                <select style={{ ...inputSty, cursor: 'pointer' }} value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}>
                                    <option value="">Select…</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </LF>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <LF label="Description">
                                    <textarea style={{ ...inputSty, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description of the dish…" />
                                </LF>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {([
                                { key: 'isVeg', label: 'Vegetarian', on: '#16a34a' },
                                { key: 'isTrending', label: 'Trending', on: '#f97316' },
                                { key: 'available', label: 'Available', on: '#3b82f6' },
                            ] as const).map(({ key, label, on }) => (
                                <button key={key} type="button" onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '9999px', border: `1.5px solid ${form[key] ? on + '50' : 'rgba(0,0,0,0.1)'}`, background: form[key] ? on + '12' : 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: form[key] ? on : '#94a3b8', transition: 'all 0.18s' }}>
                                    {form[key] ? <CheckCircle2 size={13} /> : <X size={13} />} {label}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button onClick={() => setShowDialog(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1.5px solid rgba(0,0,0,0.12)', background: 'white', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '0.75rem', borderRadius: '0.875rem', border: 'none', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: 'white', fontWeight: 800, cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: saving ? 0.75 : 1 }}>
                                {saving ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving…</> : editItem ? 'Save Changes' : 'Add Dish'}
                            </button>
                        </div>
                    </div>
                </Dialog>
            )}

            {/* Delete confirm */}
            {deleteId && (
                <Dialog title="Delete Dish?" onClose={() => setDeleteId(null)}>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>This action <strong>cannot be undone</strong>. The dish will be permanently removed from the menu.</p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1.5px solid rgba(0,0,0,0.12)', background: 'white', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                        <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: 'none', background: '#ef4444', color: 'white', fontWeight: 800, cursor: deleting ? 'wait' : 'pointer', opacity: deleting ? 0.75 : 1 }}>
                            {deleting ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default AdminMenu;
