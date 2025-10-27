import React from 'react';

interface Variant {
  id: number;
  image_url?: string;
}

interface VariantGalleryProps {
  variants: Variant[];
  onVariantClick: (variantId: number) => void;
}

const VariantGallery: React.FC<VariantGalleryProps> = ({ variants, onVariantClick }) => {
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {variants.map(v => (
        <img 
          key={v.id} 
          src={getImageUrl(v.image_url)} 
          alt={`Variant ${v.id}`} 
          className="w-full h-64 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onVariantClick(v.id)}
        />
      ))}
    </div>
  );
};

export default VariantGallery;
