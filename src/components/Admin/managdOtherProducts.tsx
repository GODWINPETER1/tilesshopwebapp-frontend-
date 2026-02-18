import React, { useState, useEffect } from 'react';
import { otherProductAPI } from '../../services/api';
import { OtherProduct } from '../../types';
import OtherProductForm from './otherProductForm';

const ManageOtherProducts: React.FC = () => {
  const [products, setProducts] = useState<OtherProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<OtherProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await otherProductAPI.getAll();
      if (res.data.success) {
        setProducts(res.data.data ?? []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch other products');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x400?text=No+Image';
  }

  // Already full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Backend base
  const backend =
    import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ||
    'http://localhost:5000';

  return `${backend}${imagePath}`;
};


  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (p: OtherProduct) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await otherProductAPI.delete(id);
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const successForm = () => {
    closeForm();
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-300">
          Loading products...
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Other Products</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No other products yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Click “Add Product” to create one.
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-700 rounded shadow overflow-hidden border border-gray-200 dark:border-gray-600"
            >
              {/* Image */}
              <div className="h-40 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <img
                  src={getImageUrl(p.image)}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{p.brand}</p>

                {p.category && (
                  <p className="text-sm text-gray-500 mt-1">
                    Category: {p.category}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <OtherProductForm
          product={editing}
          onClose={closeForm}
          onSuccess={successForm}
        />
      )}
    </div>
  );
};

export default ManageOtherProducts;
