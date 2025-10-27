import React from 'react';


const Header: React.FC = () => {
  

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 dark:bg-gray-900 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              TileCraft
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Products', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;