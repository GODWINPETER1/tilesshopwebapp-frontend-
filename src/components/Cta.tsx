import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'John Doe',
    role: 'Homeowner',
    text: 'TileCraft transformed my living room! Amazing quality and fast delivery.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Jane Smith',
    role: 'Interior Designer',
    text: 'A great selection of tiles, perfect for modern and classic designs.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Michael Brown',
    role: 'Architect',
    text: 'High-quality materials and excellent support. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12">
          Real reviews from people who transformed their space with TileCraft.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">"{t.text}"</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} className="text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
