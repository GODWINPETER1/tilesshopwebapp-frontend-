import React, { useState } from "react";
import {
  HiMenu,
  HiX,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import {
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSearchStore } from "../store/search.store";
import headLogo from "../assets/head.png";
import { useCart } from "../context/CartContext";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const navigate = useNavigate();

  const { cartItemCount } = useCart();

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useSearchStore();

  const navItems = [
    "Home",
    "Products",
    "About",
    "Contact",
  ];

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    setIsMobileMenuOpen(false);

    navigate("/search");
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  /*
  |--------------------------------------------------------------------------
  | CART
  |--------------------------------------------------------------------------
  */

  const handleCartClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/cart");
  };

  /*
  |--------------------------------------------------------------------------
  | LOGO
  |--------------------------------------------------------------------------
  */

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md transition-all duration-300">

      {/* =========================================================
          DESKTOP / MAIN HEADER
      ========================================================= */}

      <div className="container mx-auto px-4 sm:px-6 py-3">

        <div className="flex items-center justify-between gap-4">

          {/* =====================================================
              LOGO
          ===================================================== */}

          <div className="flex items-center flex-shrink-0">

            <img
              src={headLogo}
              alt="TileCraft Logo"
              onClick={handleLogoClick}
              className="
                w-16 h-16
                sm:w-20 sm:h-20
                object-contain
                cursor-pointer
                hover:scale-105
                transition-transform
                duration-300
              "
            />

          </div>


          {/* =====================================================
              DESKTOP SEARCH
          ===================================================== */}

          <div className="hidden md:block flex-1 max-w-xl">

            <div className="relative">

              {/* Search Icon */}

              <Search
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />

              {/* Input */}

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products, brands or categories..."
                aria-label="Search products"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  pl-12
                  pr-24
                  text-sm
                  font-medium
                  text-gray-900
                  outline-none

                  placeholder:text-gray-400

                  focus:border-green-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-green-500/10

                  transition-all
                  duration-200
                "
              />

              {/* Clear */}

              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="
                    absolute
                    right-14
                    top-1/2
                    -translate-y-1/2
                    p-1.5
                    rounded-full
                    text-gray-400
                    hover:text-gray-700
                    hover:bg-gray-100
                    dark:hover:bg-gray-700
                    transition
                  "
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}

              {/* Search Button */}

              <button
                type="button"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="
                  absolute
                  right-1.5
                  top-1/2
                  -translate-y-1/2
                  h-9
                  px-4
                  rounded-xl
                  bg-green-600
                  text-white
                  text-sm
                  font-medium

                  hover:bg-green-700

                  disabled:bg-gray-300
                  disabled:cursor-not-allowed

                  dark:disabled:bg-gray-700

                  transition
                "
              >
                Search
              </button>

            </div>

          </div>


          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">

            {/* =================================================
                CART
            ================================================= */}

            <button
              type="button"
              onClick={handleCartClick}
              className="
                relative
                cursor-pointer
                p-2.5
                rounded-lg
                bg-gray-100
                dark:bg-gray-800
                text-gray-700
                dark:text-gray-300
                hover:bg-gray-200
                dark:hover:bg-gray-700
                transition-all
                duration-200
              "
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >

              <HiOutlineShoppingCart size={25} />

              {cartItemCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1.5
                    -right-1.5
                    min-w-[20px]
                    h-5
                    px-1
                    flex
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-white
                    text-xs
                    font-bold
                    border-2
                    border-white
                    dark:border-gray-900
                  "
                >
                  {cartItemCount > 99
                    ? "99+"
                    : cartItemCount}
                </span>
              )}

            </button>


            {/* =================================================
                THEME BUTTON
            ================================================= */}

            <button
              type="button"
              className="
                hidden sm:block
                p-2
                rounded-lg
                bg-gray-100
                dark:bg-gray-800
                text-gray-600
                dark:text-gray-300
                hover:bg-gray-200
                dark:hover:bg-gray-700
                transition-colors
                duration-200
              "
              aria-label="Toggle theme"
            >
              🌙
            </button>


            {/* =================================================
                MOBILE MENU
            ================================================= */}

            <button
              type="button"
              className="
                md:hidden
                p-2
                rounded-lg
                text-gray-700
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-gray-800
                transition-all
              "
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


        {/* =====================================================
            MOBILE SEARCH
        ===================================================== */}

        <div className="md:hidden mt-3">

          <div className="relative">

            <Search
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products..."
              aria-label="Search products"
              className="
                w-full
                h-11
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                pl-11
                pr-20
                text-sm
                outline-none

                focus:border-green-500
                focus:bg-white
                focus:ring-4
                focus:ring-green-500/10

                dark:bg-gray-800
                dark:border-gray-700
                dark:text-white

                transition
              "
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="
                  absolute
                  right-12
                  top-1/2
                  -translate-y-1/2
                  p-1
                  text-gray-400
                "
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="button"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="
                absolute
                right-1.5
                top-1/2
                -translate-y-1/2
                h-8
                px-3
                rounded-lg
                bg-green-600
                text-white
                text-xs
                font-medium

                hover:bg-green-700

                disabled:bg-gray-300
                disabled:cursor-not-allowed

                transition
              "
            >
              Search
            </button>

          </div>

        </div>

      </div>


      {/* =========================================================
          MOBILE MENU
      ========================================================= */}

      {isMobileMenuOpen && (

        <nav
          className="
            md:hidden
            bg-white
            dark:bg-gray-900
            shadow-lg
            border-t
            border-gray-100
            dark:border-gray-800
          "
        >

          <ul className="flex flex-col space-y-2 p-4">

            {navItems.map((item) => (

              <li key={item}>

                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="
                    block
                    text-gray-700
                    dark:text-gray-300
                    hover:text-blue-600
                    dark:hover:text-blue-400
                    font-medium
                    px-3
                    py-2
                    rounded-lg
                    hover:bg-gray-50
                    dark:hover:bg-gray-800
                    transition-all
                  "
                >
                  {item}
                </a>

              </li>

            ))}


            {/* ===============================================
                MOBILE CART
            =============================================== */}

            <li>

              <button
                type="button"
                onClick={handleCartClick}
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  text-gray-700
                  dark:text-gray-300
                  hover:text-blue-600
                  dark:hover:text-blue-400
                  font-medium
                  px-3
                  py-2
                  rounded-lg
                  hover:bg-gray-50
                  dark:hover:bg-gray-800
                  transition-all
                "
              >

                <span className="flex items-center gap-3">

                  <HiOutlineShoppingCart size={22} />

                  Shopping Cart

                </span>

                {cartItemCount > 0 && (

                  <span
                    className="
                      bg-blue-600
                      text-white
                      text-xs
                      font-bold
                      min-w-[22px]
                      h-[22px]
                      px-1
                      rounded-full
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {cartItemCount > 99
                      ? "99+"
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