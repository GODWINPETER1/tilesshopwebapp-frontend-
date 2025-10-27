// import React, { useState, useEffect } from 'react';
// import axios from '../services/api';
// import { Product, ProductFormData } from '../types';
// import { motion } from 'framer-motion';

// const AdminPanel: React.FC = () => {
//   const [formData, setFormData] = useState<ProductFormData>({
//     name: '',
//     brand: '',
//     series: '',
//     code: '',
//     size: '',
//     pcsPerCtn: 0,
//     m2PerCtn: 0,
//     kgPerCtn: 0,
//     stock: 0,
//     description: '',
//   });
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [editingId, setEditingId] = useState<number | null>(null);

//   // Fetch products
//   const fetchProducts = async () => {
//     try {
//       const data = await axios.getProducts();
//       setProducts(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const submitData: ProductFormData = {
//         ...formData,
//         pcsPerCtn: Number(formData.pcsPerCtn),
//         m2PerCtn: Number(formData.m2PerCtn),
//         kgPerCtn: Number(formData.kgPerCtn),
//         stock: Number(formData.stock),
//         ...(image && { image }),
//       };

//       if (editingId) {
//         await cmsService.updateProduct(editingId, submitData);
//         setMessage('Product updated successfully!');
//       } else {
//         await cmsService.createProduct(submitData);
//         setMessage('Product created successfully!');
//       }

//       // Reset form
//       setFormData({
//         name: '',
//         brand: '',
//         series: '',
//         code: '',
//         size: '',
//         pcsPerCtn: 0,
//         m2PerCtn: 0,
//         kgPerCtn: 0,
//         stock: 0,
//         description: '',
//       });
//       setImage(null);
//       setEditingId(null);
//       fetchProducts();
//     } catch (error) {
//       console.error(error);
//       setMessage('Error saving product.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setFormData({
//       name: product.name,
//       brand: product.brand,
//       series: product.series,
//       code: product.code,
//       size: product.size,
//       pcsPerCtn: product.pcsPerCtn,
//       m2PerCtn: product.m2PerCtn,
//       kgPerCtn: product.kgPerCtn,
//       stock: product.stock,
//       description: product.description,
//     });
//     setImage(null);
//     setEditingId(product.id);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;
//     try {
//       await cmsService.deleteProduct(id.toString());
//       setMessage('Product deleted successfully!');
//       fetchProducts();
//     } catch (error) {
//       console.error(error);
//       setMessage('Error deleting product.');
//     }
//   };

//   const getImageUrl = (imagePath?: string) => {
//     if (!imagePath) return 'https://via.placeholder.com/150';
//     if (imagePath.startsWith('http')) return imagePath;
//     return `http://localhost:5000${imagePath}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
//       <div className="container mx-auto px-4 max-w-5xl space-y-10">

//         {/* Add/Edit Form */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//             {editingId ? 'Edit Product' : 'Add New Product'}
//           </h1>
//           {message && (
//             <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}`}>
//               {message}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {['name', 'brand', 'series', 'code', 'size'].map(field => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
//                     {field.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                     type="text"
//                     name={field}
//                     value={formData[field as keyof ProductFormData] || ''}
//                     onChange={handleInputChange}
//                     required={['name', 'brand', 'code'].includes(field)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
//                   />
//                 </div>
//               ))}
//               {['pcsPerCtn', 'm2PerCtn', 'kgPerCtn', 'stock'].map(field => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
//                     {field.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                     type="number"
//                     name={field}
//                     value={formData[field as keyof ProductFormData] || 0}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Product Image
//               </label>
//               <input
//                 type="file"
//                 onChange={handleImageChange}
//                 className="w-full text-sm"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 bg-black text-white rounded-md hover:bg-primary-600 transition-colors"
//             >
//               {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
//             </button>
//           </form>
//         </div>

//         {/* Product List Table */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Product List</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 dark:bg-gray-700">
//                   {['Image', 'Name', 'Brand', 'Code', 'Stock', 'Actions'].map(header => (
//                     <th key={header} className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">{header}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map(product => (
//                   <motion.tr
//                     key={product.id}
//                     whileHover={{ scale: 1.02 }}
//                     className="border-b border-gray-200 dark:border-gray-700"
//                   >
//                     <td className="px-4 py-2">
//                       <img src={getImageUrl(product.image)} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
//                     </td>
//                     <td className="px-4 py-2 text-gray-900 dark:text-white">{product.name}</td>
//                     <td className="px-4 py-2 text-gray-900 dark:text-white">{product.brand}</td>
//                     <td className="px-4 py-2 text-gray-900 dark:text-white">{product.code}</td>
//                     <td className="px-4 py-2 text-gray-900 dark:text-white">{product.stock}</td>
//                     <td className="px-4 py-2 flex gap-2">
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//             {products.length === 0 && <p className="mt-4 text-gray-500 dark:text-gray-400">No products available.</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;
