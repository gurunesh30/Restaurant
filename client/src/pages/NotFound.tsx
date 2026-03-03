import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="container py-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-5">
                Oops! The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
