import React from 'react';
import { motion } from 'framer-motion';
import { type Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    
    if (import.meta.env.PROD) {
      const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://your-backend-app.railway.app';
      return `${backendUrl}${imagePath}`;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 200 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl overflow-hidden cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {product.name}
        </h3>
        {/* <p
          className={`text-sm font-medium ${
            product. ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p> */}
      </div>
    </motion.div>
  );
};

export default ProductCard;