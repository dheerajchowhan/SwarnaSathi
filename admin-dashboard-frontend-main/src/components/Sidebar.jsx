import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Layers, Image, Users2, DollarSign, Mail,ShoppingCartIcon, FileText, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { logout, auth } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white w-64">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-1">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${isActive('/dashboard') ? 'bg-gray-700' : ''
            }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        {auth.user?.role === 'admin' && (
          <>
            <Link
              to="/dashboard/register"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${isActive('/dashboard/register') ? 'bg-gray-700' : ''
                }`}
            >
              <Users size={20} />
              <span>Register User</span>
            </Link>
            <Link
              to="/dashboard/categories"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${location.pathname.startsWith('/dashboard/categories') ? 'bg-gray-700' : ''
                }`}
            >
              <Layers size={20} />
              <span>Categories</span>
            </Link>
            <Link
              to="/dashboard/banners"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${location.pathname.startsWith('/dashboard/banners') ? 'bg-gray-700' : ''
                }`}
            >
              <Image size={20} />
              <span>Banners</span>
            </Link>
            <Link
              to="/dashboard/products"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${location.pathname.startsWith('/dashboard/products') ? 'bg-gray-700' : ''
                }`}
            >
              <ShoppingCartIcon size={20} />
              <span>Products</span>
            </Link>
            <Link
              to="/dashboard/team"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${location.pathname.startsWith('/dashboard/team') ? 'bg-gray-700' : ''
                }`}
            >
              <Users2 size={20} />
              <span>Team</span>
            </Link>
            <Link
              to="/dashboard/investor-desk"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${
                location.pathname.startsWith('/dashboard/investor-desk') ? 'bg-gray-700' : ''
              }`}
            >
              <FileText size={20} />
              <span>Investor's Desk</span>
            </Link>
            <Link
              to="/dashboard/newsletter"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${location.pathname.startsWith('/dashboard/newsletter') ? 'bg-gray-700' : ''
                }`}
            >
              <Mail size={20} />
              <span>Newsletter</span>
            </Link>
            <Link
              to="/dashboard/settings"
              className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 ${
                location.pathname.startsWith('/dashboard/settings') ? 'bg-gray-700' : ''
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </>
        )}
      </nav>
      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 w-full text-left hover:bg-gray-700 rounded"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}