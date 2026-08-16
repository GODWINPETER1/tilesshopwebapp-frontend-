import { useMemo } from "react";
import { useProducts } from "./useProducts";
import { useSearchStore } from "../store/search.store";

export const useProductSearch = () => {
  const { data, isLoading, error } = useProducts();

  const { searchQuery } = useSearchStore();

  const products = useMemo(() => {
    const productsData = data?.data ?? [];

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return productsData;
    }

    return productsData.filter((product) => {
      const name =
        product.name?.toLowerCase() ?? "";

     

      const description =
        product.description?.toLowerCase() ?? "";

      const brand =
        product.brand?.toLowerCase() ?? "";

      const category =
        product.category.toLowerCase() ?? "";

      return (
        name.includes(query) ||
        description.includes(query) ||
        brand.includes(query) ||
        category.includes(query)
      );
    });
  }, [data, searchQuery]);

  return {
    products,
    isLoading,
    error,
  };
};