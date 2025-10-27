import React, { useState, useEffect } from 'react';
import { variantAPI, productAPI } from '../../services/api';
import { Variant, Product } from '../../types';
import VariantForm from './variantsForm';

const ManageVariants: React.FC = () => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
  try {
    setLoading(true);

    // Fetch products
    const productsResponse = await productAPI.getAll();
    const fetchedProducts = productsResponse.data?.data ?? [];
    setProducts(fetchedProducts); // always an array

    // Fetch variants for each product
    const allVariants: Variant[] = [];
    for (const product of fetchedProducts) {
      try {
        const variantsResponse = await variantAPI.getByProductId(product.id);
        if (variantsResponse.data.success) {
          allVariants.push(...(variantsResponse.data.data ?? []));
        }
      } catch (err) {
        console.error(`Error fetching variants for product ${product.id}:`, err);
      }
    }

    setVariants(allVariants);
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    setLoading(false);
  }
};


  const handleCreate = (): void => {
    setEditingVariant(null);
    setShowForm(true);
  };

  const handleEdit = (variant: Variant): void => {
    setEditingVariant(variant);
    setShowForm(true);
  };

  const handleDelete = async (variantId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        await variantAPI.delete(variantId);
        await fetchData();
        alert('Variant deleted successfully');
      } catch (err) {
        console.error('Error deleting variant:', err);
        alert('Failed to delete variant');
      }
    }
  };

  const handleFormClose = (): void => {
    setShowForm(false);
    setEditingVariant(null);
  };

  const handleFormSuccess = (): void => {
    setShowForm(false);
    setEditingVariant(null);
    fetchData();
  };

  const getProductName = (productId: number): string => {
    const product = products.find(p => p.id === productId);
    return product ? `${product.name} (${product.brand})` : 'Unknown Product';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="manage-variants">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Manage Variants
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {variants.length} variant{variants.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
        >
          Add New Variant
        </button>
      </div>

      {/* Variants Table */}
      {variants.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-700 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No variants</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new variant.</p>
          <button
            onClick={handleCreate}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Add Variant
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pcs/Ctn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    m²/Ctn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    kg/Ctn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {getProductName(variant.productId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {variant.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {variant.pcsPerCtn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {variant.m2PerCtn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {variant.kgPerCtn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {variant.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(variant)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(variant.id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Variant Form Modal */}
      {showForm && (
        <VariantForm
          variant={editingVariant}
          products={products}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ManageVariants;