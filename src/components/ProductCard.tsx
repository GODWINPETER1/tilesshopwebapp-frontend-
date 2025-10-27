import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 180 }}
      onClick={() => navigate(`/product-preview/${product.id}`)}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={getImageUrl(product.main_image_url)}
          alt={product.brand}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {product.brand}
        </h3>
      </div>
    </motion.div>
  );
};

export default ProductCard;
