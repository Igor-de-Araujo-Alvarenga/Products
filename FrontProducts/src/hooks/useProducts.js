import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const checkAuth = await api.me();

            if (checkAuth && checkAuth !== null) {
                const data = await api.getProducts();
                setProducts(data);
            } else {
                setError('Acesso inválido - Please login again');
                setProducts([]);
            }
        } catch (err) {
            console.log(err);
            setError(err.message || 'Authentication failed');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createProduct = useCallback(async (productData) => {
        setLoading(true);
        setError(null);
        try {
            const checkAuth = await api.me();

            if (!checkAuth || checkAuth === null) {
                throw new Error('Acesso inválido - Please login again');
            }

            const newProduct = await api.createProduct(productData);
            setProducts(prev => [...prev, newProduct]);
            return { success: true, product: newProduct };
        } catch (err) {
            console.log(err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    return { products, loading, error, createProduct, refetch: fetchProducts };
}