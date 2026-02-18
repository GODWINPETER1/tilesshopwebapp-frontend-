import React, { useState, useEffect } from 'react';
import { otherProductAPI } from '../../services/api';
import { OtherProduct } from '../../types';

type Props = {
  product: OtherProduct | null;
  onClose: () => void;
  onSuccess: () => void;
};

const OtherProductForm: React.FC<Props> = ({ product, onClose, onSuccess }) => {
  const [form, setForm] = useState<Partial<OtherProduct>>({
    name: '',
    brand: '',
    description: '',
    price: 0,
    stock: 0,
    category: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(product);
      setPreview(product.image || null);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) formData.append('mainImage', imageFile);

    try {
      if (product) {
        await otherProductAPI.update(product.id, formData);
      } else {
        await otherProductAPI.create(formData);
      }

      onSuccess();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-xl overflow-y-auto max-h-[95vh]">

        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {product ? 'Edit Other Product' : 'Add Other Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Product Image
            </label>

            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
                id="imageUpload"
              />

              <label htmlFor="imageUpload" className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-40 object-contain rounded"
                  />
                ) : (
                  <p className="text-gray-500">Click to upload image</p>
                )}
              </label>
            </div>
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="label">Name *</label>
              <input
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="label">Brand</label>
              <input
                name="brand"
                value={form.brand || ''}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Category</label>
              <input
                name="category"
                value={form.category || ''}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Price</label>
              <input
                type="number"
                name="price"
                value={form.price || 0}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock || 0}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description || ''}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Tailwind helper classes */}
      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #d1d5db;
            padding: 10px;
            border-radius: 8px;
            background: transparent;
          }
          .label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
            display: block;
          }
        `}
      </style>
    </div>
  );
};

export default OtherProductForm;
