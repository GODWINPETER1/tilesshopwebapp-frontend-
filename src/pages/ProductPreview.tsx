import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import VariantGallery from '../components/variantGallery';

interface Variant {
  id: number;
  size: string;
  color?: string;
  image_url?: string;
  price?: number;
  stock?: number;
  sku?: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  description?: string;
  main_image_url?: string;
  variants: Variant[];
}

const ProductPreview: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${productId}`);
      const variantsRes = await axios.get(`/products/${productId}/variants`);
      setProduct({ ...res.data.data, variants: variantsRes.data.data });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {product ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{product.brand}</h1>
          <p className="text-gray-600 mb-6">{product.brand}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Variant Images */}
            <VariantGallery 
              variants={product.variants} 
              onVariantClick={(variantId) => navigate(`/product-details/${variantId}`)}
            />

            {/* Product Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Variants</h2>
              <ul className="space-y-2">
                {product.variants.map(v => (
                  <li key={v.id} className="flex justify-between border p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/product-details/${v.id}`)}>
                    <span>{v.size} {v.color ? `- ${v.color}` : ''}</span>
                    <span>${v.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20">Loading product...</div>
      )}
    </div>
  );
};

export default ProductPreview;
