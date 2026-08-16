import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';

// Pages
import ProductDetail from './pages/ProductDetails';
import ProductPreview from './pages/ProductPreview';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/adminDashboard';
import OtherProductDetail from './pages/otherProductDetail';
import VariantsPage from './pages/variantsPage';
import CartPage from './pages/CartPage';
import OrderRequest from './pages/orderRequest';
import OrderConfirmation from './pages/orderConfirmation';


// =====================================================
// HOME PAGE
// =====================================================

function Home() {
  return (
    <>
      <Hero />
      
      <LandingPage />
    </>
  );
}


// =====================================================
// CUSTOMER LAYOUT
// =====================================================

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">

      {/* Global Header */}
      <Header />

      {/* Content */}
      <main className="pt-20">

        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Product Detail */}
          <Route
            path="/product/:variantId"
            element={<ProductDetail />}
          />

          {/* Product Variants */}
          <Route
            path="/variants/:productId"
            element={<VariantsPage />}
          />

          {/* Product Preview */}
          <Route
            path="/product-preview/:name"
            element={<ProductPreview />}
          />

          {/* Other Product */}
          <Route
            path="/other-product/:productId"
            element={<OtherProductDetail />}
          />

          {/* Cart */}
          <Route
            path="/cart"
            element={<CartPage />}
          />

          {/* Order Request */}
          <Route
            path="/order-request"
            element={<OrderRequest />}
          />

          {/* Order Confirmation */}
          <Route
            path="/order-confirmation/:orderNumber"
            element={<OrderConfirmation />}
          />

        </Routes>

      </main>

      {/* Global Footer */}
      <Features />
      <Footer />

    </div>
  );
}


// =====================================================
// APP
// =====================================================

const App: React.FC = () => {
  return (
    <Router>

      <Routes>

        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* =================================================
            CUSTOMER WEBSITE
        ================================================= */}

        <Route
          path="*"
          element={<CustomerLayout />}
        />

      </Routes>

    </Router>
  );
};


export default App;