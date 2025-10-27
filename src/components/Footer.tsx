import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">TileCraft</h2>
          <p className="text-gray-400 mb-6">
            Transforming your spaces with elegance and quality tiles. Discover
            timeless designs for every corner of your home or business.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-500 transition-colors">
              <Facebook size={22} />
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors">
              <Instagram size={22} />
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors">
              <Twitter size={22} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="/" className="hover:text-primary-500 transition-colors">Home</a></li>
            <li><a href="/#products" className="hover:text-primary-500 transition-colors">Products</a></li>
            <li><a href="/#about" className="hover:text-primary-500 transition-colors">About Us</a></li>
            <li><a href="/#contact" className="hover:text-primary-500 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-2">
              <MapPin size={20} className="text-primary-500 mt-1" />
              <span>123 Tile Street, Dar es Salaam, Tanzania</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={20} className="text-primary-500" />
              <span>+255 700 000 000</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={20} className="text-primary-500" />
              <span>info@tilecraft.co.tz</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Newsletter</h3>
          <p className="text-gray-400 mb-4">
            Subscribe to get special offers, free giveaways, and tile inspiration.
          </p>
          <form className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-3 bg-transparent focus:outline-none text-white flex-1"
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 px-4 py-3 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TileCraft. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
