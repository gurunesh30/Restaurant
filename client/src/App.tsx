import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Components
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminReservations from './pages/admin/AdminReservations';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
    return (
        // AuthProvider wraps everything so auth state is available everywhere
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                        {/* Public Routes with MainLayout */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/reservation" element={<Reservation />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* Google OAuth redirect landing */}
                            <Route path="/login-success" element={<LoginSuccess />} />
                        </Route>

                        {/* Admin Routes with AdminLayout */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="menu" element={<AdminMenu />} />
                            <Route path="reservations" element={<AdminReservations />} />
                        </Route>

                        {/* 404 Route */}
                        <Route path="*" element={<MainLayout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
