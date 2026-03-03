import React from 'react';
import type { MenuItem } from '../../types/menu.types';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    return (
        <div className="card h-100 shadow-sm border-0">
            <img
                src={item.image.url}
                className="card-img-top object-fit-cover"
                alt={item.name}
                style={{ height: '200px' }}
            />
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{item.name}</h5>
                    <span className="text-primary fw-bold">${item.price.toFixed(2)}</span>
                </div>
                <p className="card-text text-muted small">{item.description}</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="badge bg-light text-dark">
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                    <button className="btn btn-primary btn-sm rounded-pill">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
