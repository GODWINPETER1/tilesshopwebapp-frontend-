import { useQuery } from "@tanstack/react-query";
import { productAPI } from "../services/api";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productAPI.getAll();

      return response.data;
    },
  });
};