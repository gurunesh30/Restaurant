import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout: React.FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1" style={{ backgroundColor: '#F1EDE4' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
