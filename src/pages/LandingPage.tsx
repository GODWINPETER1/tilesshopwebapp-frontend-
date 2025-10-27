import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { Product } from '../types';

const LandingPage: React.FC = () => {
  const [tilesProducts, setTilesProducts] = useState<Product[]>([]);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Fetch tiles products
      const tilesResponse = await productAPI.getByCategory('tiles');
      if (tilesResponse.data.success) {
        setTilesProducts(tilesResponse.data.data ?? []);
      }
      
      // Fetch other products (all non-tiles)
      const otherResponse = await productAPI.getAll();
      if (otherResponse.data?.success && otherResponse.data.data) {
        const otherProductsData = otherResponse.data.data.filter(
          (product: Product) => product.category !== 'tiles'
        );
        setOtherProducts(otherProductsData);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;

  // Use backend URL from environment
  const backendUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
  return `${backendUrl}${imagePath}`;
};


  const handleProductClick = (product: Product): void => {
    if (product.category === 'tiles') {
      navigate(`/variants/${product.id}`);
    } else {
  
      navigate(`/product/${product.id}`);
    }
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div
      key={product.id}
      className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
      onClick={() => handleProductClick(product)}
    >
      <div className="h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/300/200';
            }}
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {product.name}
          </h3>
          <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full capitalize">
            {product.category}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
          {product.brand}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {product.series}
        </p>
        {product.category !== 'tiles' && product.description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Tiles Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Our Tiles Collection
          </h2>
          
          {tilesProducts.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tiles products available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tilesProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Other Products Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Other Products
          </h2>
          
          {otherProducts.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No other products available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LandingPage;