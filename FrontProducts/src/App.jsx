import { useEffect, useState } from 'react';
import { Login } from './components/Login';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { Modal } from './components/Modal';
import { useProducts } from './hooks/useProducts';
import { api } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products, loading, error, createProduct, refetch } = useProducts();

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCreateProduct = async (productData) => {
    const result = await createProduct(productData);
    if (result.success) {
      setIsModalOpen(false);
      await refetch();
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management</h1>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Register Product
          </button>
          <button
            style={{ marginLeft: "0.5rem" }}
            className="btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <ProductList
          products={products}
          loading={loading}
          error={error}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Product"
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsModalOpen(false)}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
}

export default App;