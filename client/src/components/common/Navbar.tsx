import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/">
                    <i className="bi bi-fire text-primary-custom me-2"></i>
                    <span className="text-dark">Indian</span><span className="text-primary-custom ms-1">Spice</span>
                </Link>
                <button
                    className="navbar-toggler border-0 shadow-none px-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-bold gap-lg-3">
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-primary-custom' : ''}`} to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-primary-custom' : ''}`} to="/menu">Menu</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-primary-custom' : ''}`} to="/reservation">Reservation</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-primary-custom' : ''}`} to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center mt-3 mt-lg-0">
                        <Link to="/login" className="btn btn-outline-dark rounded-pill px-4 fw-bold me-2">
                            Sign In
                        </Link>
                        <Link to="/reservation" className="btn btn-primary-custom rounded-pill px-4 fw-bold">
                            Book a Table
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
