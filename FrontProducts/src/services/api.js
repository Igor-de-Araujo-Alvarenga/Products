const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7086';

export const api = {
    async getProducts() {
        const response = await fetch(`${API_BASE_URL}/Products/GetAll`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    async getProductsByColor(color) {
        const response = await fetch(`${API_BASE_URL}/Products/GetAll?color=${color}`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    async createProduct(productData) {
        const response = await fetch(`${API_BASE_URL}/Products/Create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },

    async authentication(auth) {
        const response = await fetch(`${API_BASE_URL}/Authentication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(auth),
        });
        if (!response.ok) throw new Error('Failed to authenticate');
        return response.json();
    },

    async logout() {
        const response = await fetch(`${API_BASE_URL}/Authentication/Logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to logout');
        return response.json();
    },

    async me() {
        const response = await fetch(`${API_BASE_URL}/Authentication/Me`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Not authenticated');
        return response.json();
    },
};