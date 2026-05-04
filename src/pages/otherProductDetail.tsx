import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { otherProductAPI } from '../services/api';
import { OtherProduct } from '../types';

const OtherProductDetail: React.FC = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<OtherProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);

  const getImageUrl = (image?: string | null) => {
    if (!image) return 'https://via.placeholder.com/600x400?text=No+Image';

    const backend =
      import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ||
      'http://localhost:5000';

    return `${backend}${image}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await otherProductAPI.getById(Number(productId));

      if (res.data.success) {
        setProduct(res.data.data ?? null);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (!product) return <p className="p-10">Product not found</p>;

  const imageUrl = getImageUrl(product.image);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-10">

          {/* Image panel */}
          <div className="sticky top-10">

            <div
              className="relative overflow-hidden rounded-xl shadow-lg cursor-zoom-in group"
              onClick={() => setZoomOpen(true)}
            >
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </div>

            <p className="text-sm text-gray-500 mt-3 text-center">
              Click image to zoom
            </p>
          </div>

          {/* Details panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">

            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="space-y-2 text-gray-600 dark:text-gray-300">

              {product.brand && (
                <p><strong>Brand:</strong> {product.brand}</p>
              )}

              {product.category && (
                <p><strong>Category:</strong> {product.category}</p>
              )}
{/* 
              {product.stock !== undefined && (
                <p><strong>Stock:</strong> {product.stock}</p>
              )}

              {product.price !== undefined && (
                <p className="text-xl font-semibold text-blue-600">
                  ${product.price}
                </p>
              )} */}
            </div>

            {product.description && (
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Zoom modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
          onClick={() => setZoomOpen(false)}
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default OtherProductDetail;
