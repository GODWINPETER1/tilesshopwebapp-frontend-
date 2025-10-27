import React, { useState, useEffect } from 'react';
import axios from '../services/api';

interface VariantFormProps {
  fetchVariants: () => void;
  editingVariant: any | null;
  setEditingVariant: (v: any | null) => void;
  productId: number;
}

const VariantForm: React.FC<VariantFormProps> = ({ fetchVariants, editingVariant, setEditingVariant, productId }) => {
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (editingVariant) {
      setSize(editingVariant.size);
      setColor(editingVariant.color || '');
      setPrice(editingVariant.price?.toString() || '');
      setStock(editingVariant.stock?.toString() || '');
      setImage(null);
    }
  }, [editingVariant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('size', size);
    formData.append('color', color);
    formData.append('price', price);
    formData.append('stock', stock);
    if (image) formData.append('image', image);
    formData.append('product_id', productId.toString());

    try {
      if (editingVariant) {
        await axios.put(`/variants/${editingVariant.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`/variants`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchVariants();
      setSize('');
      setColor('');
      setPrice('');
      setStock('');
      setImage(null);
      setEditingVariant(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
      <input type="text" placeholder="Size" value={size} onChange={e => setSize(e.target.value)} required className="border px-3 py-2 rounded"/>
      <input type="text" placeholder="Color" value={color} onChange={e => setColor(e.target.value)} className="border px-3 py-2 rounded"/>
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border px-3 py-2 rounded"/>
      <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="border px-3 py-2 rounded"/>
      <input type="file" accept="image/*" onChange={e => e.target.files && setImage(e.target.files[0])} />
      <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded w-max">
        {editingVariant ? 'Update Variant' : 'Add Variant'}
      </button>
    </form>
  );
};

export default VariantForm;
