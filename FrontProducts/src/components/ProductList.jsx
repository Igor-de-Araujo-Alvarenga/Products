import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ProductList({ products: initialProducts, loading: initialLoading, error: initialError, refreshTrigger }) {
    const [selectedColor, setSelectedColor] = useState('all');
    const [products, setProducts] = useState(initialProducts || []);
    const [loading, setLoading] = useState(initialLoading || false);
    const [error, setError] = useState(initialError || null);
    const [uniqueColors, setUniqueColors] = useState(['all']);

    useEffect(() => {
        if (initialProducts) {
            setProducts(initialProducts);
        }
    }, [initialProducts, refreshTrigger]);

    useEffect(() => {
        if (products && products.length > 0) {
            const colors = products.map(product => product.color).filter(color => color);
            setUniqueColors(['all', ...new Set(colors)]);
        }
    }, [products]);

    const fetchProductsByColor = async (color) => {
        setLoading(true);
        setError(null);

        try {
            const data = color === "all" ? await api.getProducts() : await api.getProductsByColor(color);
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = async (event) => {
        const newColor = event.target.value;
        setSelectedColor(newColor);
        await fetchProductsByColor(newColor);
    };

    const formatPrice = (value) => {
        if (!value && value !== 0) return '0.00';

        const number = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(number)) return '0.00';

        if (Number.isInteger(number)) {
            if (number > 100) {
                return (number / 100).toFixed(2);
            }
            return number.toFixed(2);
        }

        return number.toFixed(2);
    };

    if (loading && products.length === 0) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <p>Error: {error}</p>
                <button onClick={() => fetchProductsByColor(selectedColor)} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    if (products.length === 0 && !loading) {
        return (
            <>
                <div className="filter-section">
                    <div className="filter-controls">
                        <label htmlFor="color-filter">Filter by Color: </label>
                        <select
                            id="color-filter"
                            value={selectedColor}
                            onChange={handleColorChange}
                        >
                            {uniqueColors.map(color => (
                                <option key={color} value={color}>
                                    {color === 'all' ? 'All Colors' : color}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="empty-state">
                    <p>No products found. Create your first product!</p>
                </div>
            </>
        );
    }

    return (
        <div className="table-container">
            <div className="filter-section">
                <div className="filter-controls">
                    <label htmlFor="color-filter">Filter by Color: </label>
                    <select
                        id="color-filter"
                        value={selectedColor}
                        onChange={handleColorChange}
                    >
                        {uniqueColors.map(color => (
                            <option key={color} value={color}>
                                {color === 'all' ? 'All Colors' : color}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedColor !== 'all' && (
                    <div className="filter-info">
                        Showing products with color: <strong>{selectedColor}</strong>
                    </div>
                )}
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Color</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td className="description-cell">{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>${formatPrice(product.price)}</td>
                            <td>{product.color}</td>
                            <td>
                                <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                                    {product.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {products.length === 0 && selectedColor !== 'all' && (
                <div className="no-results">
                    <p>No products found with color: {selectedColor}</p>
                </div>
            )}
        </div>
    );
}