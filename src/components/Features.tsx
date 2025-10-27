import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: '🏠',
      title: 'Premium Quality',
      description: 'All our tiles meet the highest quality standards for durability and beauty.'
    },
    {
      icon: '🎨',
      title: 'Endless Designs',
      description: 'Choose from hundreds of unique patterns, colors, and textures.'
    },
    {
      icon: '🚚',
      title: 'Free Delivery',
      description: 'Free delivery on all orders over $500 within the city limits.'
    },
    {
      icon: '🔧',
      title: 'Expert Support',
      description: 'Our tile experts are here to help you with your project.'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Tiles?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We provide the best quality and service in the industry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;