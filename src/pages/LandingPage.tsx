import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, otherProductAPI } from '../services/api';
import { Product, OtherProduct } from '../types';

const LandingPage: React.FC = () => {
  const [tilesProducts, setTilesProducts] = useState<Product[]>([]);
  const [otherProducts, setOtherProducts] = useState<OtherProduct[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);

      const tilesResponse = await productAPI.getByCategory('tiles');
      if (tilesResponse.data.success) {
        setTilesProducts(tilesResponse.data.data ?? []);
      }

      const otherResponse = await otherProductAPI.getAll();
      if (otherResponse.data.success) {
        setOtherProducts(otherResponse.data.data ?? []);
      }

    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

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

  const handleOtherClick = (product: OtherProduct) => {
    navigate(`/other-product/${product.id}`);
  };

  // 🔥 GROUP OTHER PRODUCTS BY BRAND
  const groupedByBrand = otherProducts.reduce((acc, product) => {
    const brand = product.brand || 'Unknown';

    if (!acc[brand]) {
      acc[brand] = [];
    }

    acc[brand].push(product);

    return acc;
  }, {} as Record<string, OtherProduct[]>);

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
          />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
      </div>

      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {product.brand}
        </p>
      </div>
    </div>
  );

 const OtherProductCard: React.FC<{ product: OtherProduct }> = ({ product }) => (
  <div
    onClick={() => handleOtherClick(product)}
    className="
      group
      bg-white dark:bg-gray-700
      rounded-2xl
      overflow-hidden
      cursor-pointer
      shadow-sm
      hover:shadow-xl
      transition-all duration-300
      hover:-translate-y-1
    "
  >
    {/* IMAGE */}
    <div className="relative h-52 overflow-hidden">
      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        className="
          w-full h-full object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
      />

      {/* subtle overlay */}
      <div className="
        absolute inset-0
        bg-gradient-to-t from-black/40 via-transparent to-transparent
        opacity-0 group-hover:opacity-100
        transition
      " />
    </div>

    {/* CONTENT */}
    <div className="p-5 space-y-2">

      {/* PRODUCT NAME */}
      <h3 className="
        text-base font-semibold
        text-gray-800 dark:text-white
        line-clamp-2
        group-hover:text-green-600
        transition
      ">
        {product.name}
      </h3>

      {/* BRAND (subtle) */}
      <p className="text-sm text-gray-500 dark:text-gray-300">
        {product.brand}
      </p>

      {/* ACTION INDICATOR */}
      <div className="
        flex items-center justify-between pt-2
        text-sm font-medium
        text-green-600
        opacity-0 group-hover:opacity-100
        transition
      ">
        <span>View Product</span>
        <span className="transform group-hover:translate-x-1 transition">
          →
        </span>
      </div>

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
            <div className="text-center text-gray-500 py-8">
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
            <div className="text-center text-gray-500 py-8">
              coming soon
            </div>
          ) : (
            <>
              {/* 🟢 SHOW BRANDS */}
              {!selectedBrand && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.keys(groupedByBrand).map((brand) => (
                    <div
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className="cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:scale-105 transition text-center"
                    >
                      <img
                        src={getImageUrl(groupedByBrand[brand][0]?.image)}
                        className="h-24 w-full object-cover rounded mb-3"
                      />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {brand}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {groupedByBrand[brand].length} products
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 🔵 SHOW PRODUCTS UNDER BRAND */}
              {selectedBrand && (
                <>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="mb-6 text-blue-600 hover:underline"
                  >
                    ← Back to Brands
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groupedByBrand[selectedBrand].map(product => (
                      <OtherProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>

      </div>
    </div>
  );
};

export default LandingPage;