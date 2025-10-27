import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand / About */}
        <div>
          {/* Replace TileCraft text with logo */}
          <img
            src="/logo.png" // 🟢 Make sure logo.png is in your public/ folder
            alt="Barongo General Supply Ltd"
            className="w-36 mb-4"
          />
          <p className="text-gray-400 mb-6">
            Transforming your spaces with elegance and quality tiles. Discover
            timeless designs for every corner of your home or business.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/barongo_general_supply_lt/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
            >
              <Instagram size={22} />
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors">
              <Facebook size={22} />
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
              <span>Dar es Salaam, Tanzania</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={20} className="text-primary-500" />
              <span>+255 695 337 830</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={20} className="text-primary-500" />
              <span>info@barongogeneralsupply.co.tz</span>
            </li>
          </ul>
        </div>

        {/* Google Map */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Find Us</h3>
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-800">
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31809.548969127828!2d39.2361!3d-6.7924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b0b6d47c4f3%3A0xa79ccf94c0d55689!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2stz!4v1698304232951!5m2!1sen!2stz"
              width="100%"
              height="200"
              loading="lazy"
              className="border-0 w-full h-48"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Barongo General Supply Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
