import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar Placeholder */}
            <aside className="bg-dark text-white p-4" style={{ width: '250px' }}>
                <h4 className="border-bottom border-secondary pb-3 mb-4">Admin Panel</h4>
                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <Link to="/admin/dashboard" className="nav-link text-white ps-0">Dashboard</Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/admin/menu" className="nav-link text-white ps-0">Menu Management</Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/admin/bookings" className="nav-link text-white ps-0">Reservations</Link>
                    </li>
                </ul>
                <div className="mt-auto pt-4 border-top border-secondary position-absolute bottom-0 mb-4">
                    <Link to="/" className="text-secondary text-decoration-none">← Back to Site</Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow-1 p-4 bg-light">
                <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <h2 className="mb-0">Admin Dashboard</h2>
                    <div className="d-flex align-items-center">
                        <span className="me-3">Admin User</span>
                        <button className="btn btn-outline-secondary btn-sm">Logout</button>
                    </div>
                </header>

                {/* Content injected here */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
