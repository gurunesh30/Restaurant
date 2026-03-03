import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    return (
        <div className="container py-5 text-center">
            <h1>Welcome to Indian Spice</h1>
            <Link to="/home" className="btn btn-primary mt-3">Enter Site</Link>
        </div>
    );
};

export default Landing;
