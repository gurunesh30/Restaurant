import React from 'react';
import type { MenuItem } from '../../types/menu.types';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    return (
        <div className="card h-100 border-0 shadow-sm" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
        }}>
            <div className="position-relative">
                <img
                    src={item.image.url}
                    className="card-img-top object-fit-cover"
                    alt={item.name}
                    style={{ height: '200px', width: '100%' }}
                />
                <span
                    className={`badge position-absolute top-0 end-0 m-3 p-2 rounded-circle border border-2 border-white ${item.isVeg ? 'bg-success' : 'bg-danger'}`}
                    title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    style={{ width: '20px', height: '20px' }}
                >
                    <span className="visually-hidden">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                </span>
                {item.isTrending && (
                    <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm">
                        Top Rated
                    </span>
                )}
            </div>
            <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0 text-dark" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {item.name}
                    </h5>
                    <span className="fs-5 fw-bold ms-2" style={{ color: '#E64A19' }}>
                        ${item.price.toFixed(2)}
                    </span>
                </div>
                <p className="card-text text-muted small flex-grow-1" style={{ fontFamily: "'Lexend', sans-serif" }}>
                    {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-warning small fw-bold">
                        ★ {item.rating.toFixed(1)}
                    </div>
                    <button
                        className="btn btn-sm rounded-pill px-4 fw-bold shadow-sm"
                        style={{
                            backgroundColor: '#333333',
                            color: '#ffffff',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E64A19'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333333'}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
