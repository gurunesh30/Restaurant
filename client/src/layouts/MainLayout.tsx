import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageTransition from '../components/common/PageTransition';

const MainLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <PageTransition key={location.pathname}>
                    <Outlet />
                </PageTransition>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
