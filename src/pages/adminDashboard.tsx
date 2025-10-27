import React, { useState } from 'react';
import ManageProducts from '../components/Admin/manageProducts';
import ManageVariants from '../components/Admin/manageVariants';

type AdminTab = 'products' | 'variants';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [error, setError] = useState('');

  // Change this password to something secure that you'll share with the admin
  const ADMIN_PASSWORD = 'irene2025';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  // Password gate - show this if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg mb-4">
              <h1 className="text-2xl font-bold text-white mb-2">
                Admin Access
              </h1>
              <p className="text-blue-100">
                Enter password to access the admin dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Contact the administrator if you've forgotten the password
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main admin dashboard (only shown after authentication)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header with logout button */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded-md text-sm transition-colors"
            >
              Logout
            </button>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-blue-100 mt-2">Manage your products and variants</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('products')}
              >
                Manage Products
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === 'variants'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('variants')}
              >
                Manage Variants
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'products' && <ManageProducts />}
            {activeTab === 'variants' && <ManageVariants />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;