import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/api';
import VariantForm from '../components/variantForm';

interface Variant {
  id: number;
  size: string;
  color?: string;
  image_url?: string;
  price?: number;
  stock?: number;
  sku?: string;
}

const ProductVariantsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`/products/${productId}/variants`);
      setVariants(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchVariants();
  }, [productId]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    try {
      await axios.delete(`/variants/${id}`);
      fetchVariants();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Variants</h1>

      <VariantForm 
        fetchVariants={fetchVariants} 
        editingVariant={editingVariant} 
        setEditingVariant={setEditingVariant} 
        productId={Number(productId)}
      />

      {loading ? (
        <div className="text-center py-10">Loading variants...</div>
      ) : (
        <table className="min-w-full border border-gray-200 mt-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Size</th>
              <th className="border px-4 py-2">Color</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Stock</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map(v => (
              <tr key={v.id}>
                <td className="border px-4 py-2">{v.size}</td>
                <td className="border px-4 py-2">{v.color}</td>
                <td className="border px-4 py-2">${v.price}</td>
                <td className="border px-4 py-2">{v.stock}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button 
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditingVariant(v)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(v.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductVariantsPage;
