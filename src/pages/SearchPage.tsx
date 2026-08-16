import { useProductSearch } from "../hooks/useProductSearch";
import { useSearchStore } from "../store/search.store";

const SearchPage = () => {
  const {
    products,
    isLoading,
    error,
  } = useProductSearch();

  const { searchQuery } = useSearchStore();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        Failed to load products.
      </div>
    );
  }

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold">
        Search Results
      </h1>

      {searchQuery && (
        <p className="mt-2 text-gray-500">
          Results for "{searchQuery}"
        </p>
      )}

      {products.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">

          {products.map((product) => (

            <div
              key={product.id}
              className="rounded-2xl bg-white p-3 shadow-sm"
            >

              <img
                src={
                  product.image ||
                  "/placeholder-product.png"
                }
                alt={product.name}
                className="h-40 w-full rounded-xl object-cover"
              />

              <h3 className="mt-3 font-semibold">
                {product.name}
              </h3>

              {product.brand && (
                <p className="text-sm text-gray-500">
                  {product.brand}
                </p>
              )}

              {product.category && (
                <p className="text-xs text-gray-400">
                  {product.category}
                </p>
              )}

              

            </div>

          ))}

        </div>
      )}

      {products.length === 0 && (
        <div className="py-16 text-center">

          <h2 className="text-lg font-semibold">
            No products found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try searching for another product,
            brand, or category.
          </p>

        </div>
      )}

    </div>
  );
};

export default SearchPage;