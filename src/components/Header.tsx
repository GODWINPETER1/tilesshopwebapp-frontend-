import React, { useState } from 'react';
import { HiMenu, HiX, HiOutlineShoppingCart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

import headLogo from '../assets/head.png';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const navigate = useNavigate();

  const { cartItemCount } = useCart();

  const navItems = [
    'Home',
    'Products',
    'About',
    'Contact',
  ];

  const handleCartClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/cart');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md transition-all duration-300">

      <div className="container mx-auto px-6 py-3 flex justify-between items-center">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex items-center">

          <img
            src={headLogo}
            alt="TileCraft Logo"
            onClick={handleLogoClick}
            className="w-20 h-20 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
          />

        </div>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        {/* 
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
        */}


        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div className="flex items-center space-x-3">

          {/* ===============================================
              CART BUTTON
          =============================================== */}

          <button
            type="button"
            onClick={handleCartClick}
            className="relative cursor-pointer p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >

            <HiOutlineShoppingCart
              size={25}
            />

            {/* Cart badge */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold border-2 border-white dark:border-gray-900">
                {cartItemCount > 99
                  ? '99+'
                  : cartItemCount}
              </span>
            )}

          </button>


          {/* ===============================================
              THEME BUTTON
          =============================================== */}

          <button
            type="button"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            🌙
          </button>


          {/* ===============================================
              MOBILE MENU BUTTON
          =============================================== */}

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() =>
              setIsMobileMenuOpen(
                !isMobileMenuOpen
              )
            }
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiX size={24} />
            ) : (
              <HiMenu size={24} />
            )}
          </button>

        </div>

      </div>


      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100 dark:border-gray-800">

          <ul className="flex flex-col space-y-2 p-4">

            {navItems.map((item) => (
              <li key={item}>

                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {item}
                </a>

              </li>
            ))}


            {/* Mobile cart */}
            <li>

              <button
                type="button"
                onClick={handleCartClick}
                className="w-full  flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >

                <span className="flex cursor-pointer items-center gap-3">

                  <HiOutlineShoppingCart
                    size={22}
                  />

                  Shopping Cart

                </span>


                {cartItemCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center">
                    {cartItemCount > 99
                      ? '99+'
                      : cartItemCount}
                  </span>
                )}

              </button>

            </li>

          </ul>

        </nav>
      )}

    </header>
  );
};

export default Header;