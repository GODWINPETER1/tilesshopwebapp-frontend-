import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import headLogo from '../assets/head.png'; // ✅ Ensure this path is correct

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ['Home', 'Products', 'About', 'Contact'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md transition-all duration-300">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* ✅ Logo only (no text) */}
        <div className="flex items-center">
          <img
            src={headLogo}
            alt="TileCraft Logo"
            className="w-20 h-20 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* ✅ Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* ✅ Right Actions + Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Placeholder */}
          <button
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            🌙
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100 dark:border-gray-800">
          <ul className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
