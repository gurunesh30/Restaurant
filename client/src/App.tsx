import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Public Routes with MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* Admin Routes with AdminLayout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<div>Admin Dashboard Placeholder</div>} />
                    <Route path="dashboard" element={<div>Admin Dashboard Placeholder</div>} />
                    <Route path="menu" element={<div>Admin Menu Placeholder</div>} />
                    <Route path="bookings" element={<div>Admin Bookings Placeholder</div>} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<MainLayout />} >
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
