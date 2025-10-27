import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductDetail from './pages/ProductDetails';
import Footer from './components/Footer';
import Testimonials from './components/Cta';
import ProductPreview from './pages/ProductPreview';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/adminDashboard';
import OtherProductDetail from './pages/otherProductDetail';
import VariantsPage from './pages/variantsPage'; // 👈 New

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <LandingPage />
        <Testimonials/>
      </main>
      <Footer />
    </>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:variantId" element={<ProductDetail />} />
            <Route path="/variants/:productId" element={<VariantsPage />} /> 
            <Route path='/product-preview/:name' element={<ProductPreview/>}/>
            <Route path='/product/:productId' element={<OtherProductDetail/>}/>
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;