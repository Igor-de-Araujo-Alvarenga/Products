import { useState } from 'react';

const initialFormData = {
    name: '',
    description: '',
    quantity: 0,
    price: '',
    color: '',
};

export function ProductForm({ onSubmit, onCancel, isLoading }) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value) return 'Name is required';
                if (value.length > 100) return 'Name must not exceed 100 characters';
                return '';
            case 'description':
                if (!value) return 'Description is required';
                if (value.length > 500) return 'Description must not exceed 500 characters';
                return '';
            case 'quantity':
                if (value === '' || value === null) return 'Quantity is required';
                if (value < 0) return 'Quantity must be a positive number';
                return '';
            case 'price':
                if (value === '' || value === null) return 'Price is required';
                const numValue = parseFloat(value);
                if (isNaN(numValue)) return 'Price must be a valid number';
                if (numValue <= 0) return 'Price must be a positive number';
                return '';
            case 'color':
                if (!value) return 'Color is required';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (name === 'price') {
            const filteredValue = value.replace(/[^0-9.]/g, '');
            const decimalPoints = (filteredValue.match(/\./g) || []).length;
            let finalValue = filteredValue;
            if (decimalPoints > 1) {
                const parts = filteredValue.split('.');
                finalValue = parts[0] + '.' + parts.slice(1).join('');
            }

            setFormData(prev => ({ ...prev, [name]: finalValue }));
            const error = validateField(name, finalValue);
            setErrors(prev => ({ ...prev, [name]: error }));
            return;
        }

        const parsedValue = type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
        const error = validateField(name, parsedValue);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            price: parseFloat(formData.price)
        };

        const newErrors = {};
        Object.keys(submitData).forEach(field => {
            const error = validateField(field, submitData[field]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await onSubmit(submitData);
        setFormData(initialFormData);
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    disabled={isLoading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={errors.description ? 'error' : ''}
                    disabled={isLoading}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className={errors.quantity ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price *</label>
                    <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={errors.price ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.price && <span className="error-message">{errors.price}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="color">Color *</label>
                <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Red, Blue, Green"
                    className={errors.color ? 'error' : ''}
                    disabled={isLoading}
                />
                {errors.color && <span className="error-message">{errors.color}</span>}
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}