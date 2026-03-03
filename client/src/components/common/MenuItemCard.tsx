import React from 'react';
import type { MenuItem } from '../../types/menu.types';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    return (
        <div className="card h-100 border-0 shadow-sm card-hover bg-white rounded-4 overflow-hidden">
            <div className="position-relative">
                <img
                    src={item.image.url}
                    className="card-img-top object-fit-cover"
                    alt={item.name}
                    style={{ height: '220px', width: '100%' }}
                />
                {/* Veg/Non-Veg Badge */}
                <span
                    className={`position-absolute top-0 end-0 m-3 p-1 rounded bg-white shadow-sm d-flex align-items-center justify-content-center`}
                    title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    style={{ width: '28px', height: '28px' }}
                >
                    <span
                        className={`rounded-circle ${item.isVeg ? 'bg-success' : 'bg-danger'}`}
                        style={{ width: '12px', height: '12px' }}
                    ></span>
                </span>

                {/* Trending Badge */}
                {item.isTrending && (
                    <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm fw-bold">
                        🔥 Best Seller
                    </span>
                )}
            </div>

            <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                    <h5 className="card-title fw-bold mb-0 text-dark">
                        {item.name}
                    </h5>
                    <span className="fs-5 fw-bold text-primary-custom flex-shrink-0">
                        ${item.price.toFixed(2)}
                    </span>
                </div>

                <p className="card-text text-muted small flex-grow-1 mt-1 mb-4" style={{ lineHeight: 1.6 }}>
                    {item.description}
                </p>

                <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                    <div className="text-warning fw-bold d-flex align-items-center">
                        <i className="bi bi-star-fill me-1"></i>
                        <span className="text-dark ms-1">{item.rating.toFixed(1)}</span>
                    </div>
                    <button
                        className="btn btn-primary-custom rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center"
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
