import React from 'react';
import { Product } from '../types';
import axios from '../services/api';

interface ProductTableProps {
  products: Product[];
  setEditingProduct: (product: Product) => void;
  fetchProducts: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, setEditingProduct, fetchProducts }) => {

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <table className="min-w-full table-auto border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Brand</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td className="border px-4 py-2">{product.id}</td>
            <td className="border px-4 py-2">{product.brand}</td>
            <td className="border px-4 py-2">{product.name}</td>
            <td className="border px-4 py-2 flex gap-2">
              <button 
                className="bg-yellow-500 text-white px-3 py-1 rounded" 
                onClick={() => setEditingProduct(product)}
              >
                Edit
              </button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded" 
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
              <button 
                className="bg-primary-500 text-white px-3 py-1 rounded" 
                onClick={() => window.location.href=`/admin/product-variants/${product.id}`}
              >
                Variants
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
