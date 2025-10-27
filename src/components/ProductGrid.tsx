import React, { useEffect, useState } from 'react';
import { type Product } from '../types';
import { cmsService } from '../services/api';
import ProductCard from './ProductCard';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const data = await cmsService.getProducts();
        setProducts(data);
        
      } catch (error) {
        setError('Failed to load products. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-300">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center max-w-lg mx-auto">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-400">
            Make sure the backend server is running on <code>http://localhost:5000</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ✨ Tiles Collection
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore our high-quality tiles — modern, classic & timeless.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">
              No products available yet.
            </p>
            <p className="text-gray-400 mt-2">
              Add some products through your admin panel or API.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
