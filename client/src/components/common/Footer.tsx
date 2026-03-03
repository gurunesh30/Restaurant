import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer bg-dark text-white pt-5 pb-4 mt-auto">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-12 col-lg-4 pe-lg-5">
                        <h4 className="fw-bold fs-4 mb-3">
                            <i className="bi bi-fire text-primary-custom me-2"></i>
                            <span>Indian</span><span className="text-primary-custom ms-1">Spice</span>
                        </h4>
                        <p className="text-secondary mb-4" style={{ lineHeight: 1.8 }}>
                            Experience authentic Indian flavors crafted with passion and traditional spices. Order online, reserve a table, and enjoy the culinary journey.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="btn btn-outline-secondary rounded-circle btn-sm d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px' }}>
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="btn btn-outline-secondary rounded-circle btn-sm d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px' }}>
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" className="btn btn-outline-secondary rounded-circle btn-sm d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px' }}>
                                <i className="bi bi-twitter-x"></i>
                            </a>
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2">
                        <h5 className="fw-bold mb-3">Quick Links</h5>
                        <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
                            <li><Link to="/home" className="text-secondary text-decoration-none nav-link p-0 hover-link">Home</Link></li>
                            <li><Link to="/menu" className="text-secondary text-decoration-none nav-link p-0 hover-link">Our Menu</Link></li>
                            <li><Link to="/reservation" className="text-secondary text-decoration-none nav-link p-0 hover-link">Book a Table</Link></li>
                            <li><Link to="/contact" className="text-secondary text-decoration-none nav-link p-0 hover-link">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="row">
                            <div className="col-12 col-sm-6 mb-4 mb-sm-0">
                                <h5 className="fw-bold mb-3">Operating Hours</h5>
                                <ul className="list-unstyled text-secondary">
                                    <li className="mb-2"><strong>Mon - Fri:</strong><br />11:00 AM - 10:00 PM</li>
                                    <li><strong>Sat - Sun:</strong><br />10:00 AM - 11:00 PM</li>
                                </ul>
                            </div>
                            <div className="col-12 col-sm-6">
                                <h5 className="fw-bold mb-3">Contact Info</h5>
                                <ul className="list-unstyled text-secondary">
                                    <li className="mb-2 d-flex">
                                        <i className="bi bi-geo-alt-fill text-primary-custom me-2 mt-1"></i>
                                        <span>123 Spice Avenue, Downtown, Food City, FC 90001</span>
                                    </li>
                                    <li className="mb-2 d-flex align-items-center">
                                        <i className="bi bi-telephone-fill text-primary-custom me-2"></i>
                                        <span>+1 (555) 123-4567</span>
                                    </li>
                                    <li className="d-flex align-items-center">
                                        <i className="bi bi-envelope-fill text-primary-custom me-2"></i>
                                        <span>contact@indianspice.com</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 pt-4 border-top border-secondary text-center text-secondary small">
                    <div className="col-12">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Indian Spice Restaurant. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
